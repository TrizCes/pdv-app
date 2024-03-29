require('dotenv').config();
const knex = require('../utilitarios/conexao');
const transportador = require('../utilitarios/conexao_nodemailer.js');

const cadastrarPedido = async (req, res) => {
  const { cliente_id, observacao, pedido_produtos } = req.body;

  const clienteExiste = await knex('clientes').where({ id: cliente_id }).first();
  if (!clienteExiste) {
    return res.status(404).json({ mensagem: 'Cliente não encontrado!' });
  }

  let valor_total = 0;
  let pedidoId;

  try {
    for (const produto of pedido_produtos) {
      const produtoId = produto.produto_id;
      const produtoExiste = await knex('produtos').where({ id: produtoId }).first();

      if (!produtoExiste) {
        return res.status(404).json({ mensagem: `Produto com ID ${produtoId} não encontrado!` });
      }

      if (produto.quantidade_produto > produtoExiste.quantidade_estoque) {
        return res.status(400).json({ mensagem: `Estoque insuficiente para o produto com ID ${produtoId}` });
      }

      valor_total += produtoExiste.valor * produto.quantidade_produto;

      produto.valor_produto = produtoExiste.valor;
    }

    [pedidoId] = await knex('pedidos').insert({ cliente_id, observacao, valor_total }).returning('id');

    for (const produto of pedido_produtos) {
      const produtoId = produto.produto_id;

      await knex('pedido_produtos').insert({
        pedido_id: pedidoId.id,
        produto_id: produtoId,
        quantidade_produto: produto.quantidade_produto,
        valor_produto: produto.valor_produto * produto.quantidade_produto,
      });

      await knex('produtos').where({ id: produtoId }).decrement('quantidade_estoque', produto.quantidade_produto);
    }

    const assunto = 'Pedido Realizado com Sucesso!';
    const mensagem = `Olá, ${clienteExiste.nome}. Seu pedido foi cadastrado com sucesso!`;

    await enviarEmail(clienteExiste, assunto, mensagem);

    return res.status(200).json({ mensagem: 'Pedido cadastrado com sucesso!' });
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno do servidor!' });
  }
};

const enviarEmail = async (cliente, assunto, mensagem) => {
  try {
    const destinatario = cliente.email;

    await transportador.sendMail({
      from: process.env.EMAIL_USER,
      to: destinatario,
      subject: assunto,
      text: mensagem,
    });

    return;
  } catch (error) {
    throw new Error('Erro ao enviar email!');
  }
};

const listarPedidos = async (req, res) => {
  const { cliente_id } = req.query;
  let resultadoPedidoProdutos = [];

  const buscarPedidoProdutos = async (pedido) => {
    const dadosDoPedidoEProduto = await knex('pedido_produtos as pp').select('*').where('pp.pedido_id', '=', pedido.id);

    return {
      pedido,
      pedido_produtos: dadosDoPedidoEProduto,
    };
  };

  const buscarPedidosCliente = async (cliente_id) => {
    const clienteExiste = await knex('clientes').select('*').where('id', cliente_id).first();

    if (!clienteExiste) {
      return { mensagem: 'Cliente não está cadastrado no sistema.' };
    }

    const pedidoDoCliente = await knex('pedidos').where({ cliente_id }).returning('*');

    if (!pedidoDoCliente || pedidoDoCliente.length === 0) {
      return { mensagem: 'Cliente não possui nenhum pedido registrado.' };
    }

    for (let pedido of pedidoDoCliente) {
      const dadosDoPedidoEProduto = await buscarPedidoProdutos(pedido);
      resultadoPedidoProdutos.push(dadosDoPedidoEProduto);
    }

    return resultadoPedidoProdutos;
  };

  const buscarTodosOsPedidos = async () => {
    const todosOsPedidos = await knex('pedidos').select('*').returning('*');

    for (let pedido of todosOsPedidos) {
      const dadosDoPedidoEProduto = await buscarPedidoProdutos(pedido);
      resultadoPedidoProdutos.push(dadosDoPedidoEProduto);
    }

    return resultadoPedidoProdutos;
  };

  try {
    if (cliente_id) {
      resultadoPedidoProdutos = await buscarPedidosCliente(cliente_id);
      return res.status(200).json(resultadoPedidoProdutos);
    } else {
      resultadoPedidoProdutos = await buscarTodosOsPedidos();
      return res.status(200).json(resultadoPedidoProdutos);
    }
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
};

module.exports = {
  cadastrarPedido,
  listarPedidos,
};


require('dotenv').config();
const knex = require("../utilitarios/conexao");
const nodemailer = require("nodemailer")

const cadastrarPedido = async (req, res) => {
  const { cliente_id, observacao, pedido_produtos } = req.body;

  const clienteExiste = await knex("clientes").where({ id: cliente_id }).first();
  if (!clienteExiste) {
    return res.status(404).json({ mensagem: "Cliente não encontrado!" });
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
    
    [pedidoId] = await knex("pedidos")
      .insert({ cliente_id, observacao, valor_total })
      .returning("id"); 

    for (const produto of pedido_produtos) {
      const produtoId = produto.produto_id;
    
      await knex("pedido_produtos").insert({
        pedido_id: pedidoId.id,
        produto_id: produtoId,
        quantidade_produto: produto.quantidade_produto,
        valor_produto: produto.valor_produto * produto.quantidade_produto,
      });
  
      await knex("produtos")
        .where({ id: produtoId })
        .decrement("quantidade_estoque", produto.quantidade_produto);
    }

    const assunto = "Pedido Realizado com Sucesso!";
    const mensagem = `Olá, ${clienteExiste.nome}. Seu pedido foi cadastrado com sucesso!`;

    await enviarEmail(clienteExiste, assunto, mensagem);

    return res.status(200).json({ mensagem: "Pedido cadastrado com sucesso!" });
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno do servidor!' });
  }
};

const enviarEmail = async (cliente, assunto, mensagem) => {
  try {
    
    const destinatario = cliente.email;

    const transportador = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transportador.sendMail({
      from: process.env.EMAIL_USER,
      to: destinatario,
      subject: assunto,
      text: mensagem,
    });

    return;
  } catch (error) {
    throw new Error("Erro ao enviar email!")
  }
};
  
  module.exports = {
    cadastrarPedido,
  };

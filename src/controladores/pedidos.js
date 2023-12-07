const knex = require('../utilitarios/conexao.js');

const listarPedidos = async (req, res) => {
    const { cliente_id } = req.query;
    let resultadoPedidoProdutos = [];

    const buscarPedidoProdutos = async (pedido) => {
        const dadosDoPedidoEProduto = await knex('pedido_produtos as pp')
            .select('*')
            .where('pp.pedido_id', '=', pedido.id);

        return {
            pedido,
            pedido_produtos: dadosDoPedidoEProduto
        };
    };

    const buscarPedidosCliente = async (cliente_id) => {
        const clienteExiste = await knex('clientes')
            .select('*')
            .where('id', cliente_id)
            .first();

        if (!clienteExiste) {
            return { mensagem: 'Cliente não está cadastrado no sistema.' };
        }

        const pedidoDoCliente = await knex('pedidos')
            .where({ cliente_id })
            .returning('*');

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
        const todosOsPedidos = await knex('pedidos')
            .select('*')
            .returning('*');

        for (let pedido of todosOsPedidos) {
            const dadosDoPedidoEProduto = await buscarPedidoProdutos(pedido);
            resultadoPedidoProdutos.push(dadosDoPedidoEProduto);
        }

        return resultadoPedidoProdutos;
    }

    try {
        if (cliente_id) {
            resultadoPedidoProdutos = await buscarPedidosCliente(cliente_id);
            return res.status(200).json(resultadoPedidoProdutos);
        } else {
            resultadoPedidoProdutos = await buscarTodosOsPedidos();
            return res.status(200).json(resultadoPedidoProdutos);
        }
    }
    catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
    }
};

module.exports = {
    listarPedidos
};
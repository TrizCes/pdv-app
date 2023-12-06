const knex = require('../utilitarios/conexao.js');

const listarPedidos = async (req, res) => {
    const { cliente_id } = req.query;

    try {
        if (cliente_id) {
            const clienteExiste = await knex('clientes').where({ cliente_id: id }).first();

            if (!clienteExiste) {
                return res.status(404).json({ mensagem: 'Cliente não está cadastrado no sistema.' });
            }

            const pedidoDoCliente = await knex('pedidos').where({ cliente_id }).first();

            if (!pedidoDoCliente || pedidoDoCliente.length === 0) {
                return res.status(404).json({ mensagem: 'Não há pedido vinculado a esse cliente.' });
            }

            const pedidoEncontrado = await knex('pedidos as p')
                .select('p.*', 'pp.*')
                .join('pedido_produtos as pp', 'pp.pedido_id', '=', 'p.id')
                .where({ cliente_id });

            return res.status(200).json(pedidoEncontrado);
        }

        const todosOsPedidos = await knex('pedidos as p')
            .select('p.*', 'pp.*')
            .join('pedido_produtos as pp');

        return res.status(200).json(todosOsPedidos);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor.' })
    }
}

module.exports = {
    listarPedidos
}
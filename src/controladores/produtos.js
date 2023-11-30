const knex = require("../utilitarios/conexao");
const { id } = require("../validacoes/schemaUsuario");

const cadastrarProduto = async (req, res) => {
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
    try {
        const produtoJaExiste = await knex('produtos').where({ descricao }).first();
        if (produtoJaExiste) {
            return res.status(400).json('Produto já está cadastrado!');
        }

        const produto = await knex("produtos").insert({ descricao, quantidade_estoque, valor, categoria_id }).returning("*");

        if (produto.rowCount === 0) {
            return res.status(400).json('O produto não foi cadastrado');
        }

        return res.status(201).json({ mensagem: "Produto cadastrado com sucesso!" });
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor!" });
    }
}

const listarProdutos = async (req, res) => {
    const { categoria_id } = req.query;
    try {
        const produtos = await knex('produtos').select('*');

        if (!categoria_id) {
            return res.status(200).json(produtos);
        }


        const produtosCategoriaId = await knex('produtos').select('*').where({ categoria_id });

        if (produtosCategoriaId.length === 0) {
            return res.status(400).json('Nenhum produto encontrado para o ID de categoria informado.');
        }


        return res.status(200).json(produtosCategoriaId);

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }

};

module.exports = {
    cadastrarProduto,
    listarProdutos
}

const knex = require("../utilitarios/conexao");


const cadastrarProduto = async (req, res) => {
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
    console.log(req.usuario.id);
    try {
        const produtoJaExiste = await knex('produtos').where({ descricao }).first();
        if (produtoJaExiste) {
            return res.status(400).json('Produto já está cadastrado!');
          }

        const produto = await knex("produtos").insert({descricao, quantidade_estoque, valor, categoria_id}).returning("*");

        if (produto.rowCount === 0) {
            return res.status(400).json('O produto não foi cadastrado');
        }

        return res.status(201).json({mensagem: "Produto cadastrado com sucesso!"});
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    cadastrarProduto
}
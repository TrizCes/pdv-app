const knex = require("../utilitarios/conexao");

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

const editarDadosDoProduto = async (req, res) => {
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
    const { id } = req.params;

    const produtoExiste = await knex('produtos').where({ id }).first();

    if (!produtoExiste) {
        return res.status(404).json({ mensagem: 'Produto não encontrado!' })
    };

    try {
        const categoriaExiste = await knex('categorias').where({ id: categoria_id }).first();

        if (!categoriaExiste) {
            return res.status(404).json({ mensagem: 'Categoria não encontrada!' })
        };

        const produtoAtualizado = await knex('produtos').update({ descricao, quantidade_estoque, valor, categoria_id }).where({ id }).returning('*');

        if (!produtoAtualizado || produtoAtualizado.length === 0) {
            return res.status(400).json({ mensagem: 'Não foi possível atualizar os dados do produto. Por favor, tente novamente!' })
        };

        return res.status(200).json({ mensagem: 'Produto atualizado com sucesso!' });

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor!" });
    };

};

const detalharProduto = async (req, res) => {
    const { id } = req.params;

    try {
        const produtoExiste = await knex('produtos').select('*').where({ id }).first();

        if (!produtoExiste) {
            return res.status(404).json({ mensagem: 'Produto não encontrado!' })
        };

        return res.status(200).json(produtoExiste);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor!" })
    };
}

module.exports = {
    cadastrarProduto,
    editarDadosDoProduto,
    detalharProduto
};

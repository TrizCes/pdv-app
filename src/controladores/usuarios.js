const knex = require('../utilitarios/conexao');
const { hash } = require('bcrypt');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const usuarioJaExiste = await knex('usuarios').where({ email }).first();

        if (usuarioJaExiste) {
            return res.status(400).json("E-mail já está cadastrado!");
        }

        const senhaCriptografada = await hash(senha, 10);

        const novoUsuario = await knex('usuarios').insert({ nome, email, senha: senhaCriptografada }).returning('*');

        if (!novoUsuario || novoUsuario.length === 0) {
            return res.status(400).json("O usuário não foi cadastrado.");
        }

        const { senha: _, ...dadosUsuario } = novoUsuario[0]

        return res.status(200).json(dadosUsuario)

    } catch (error) {
        return res.status(400).json({ mensagem: 'Erro interno no servidor' });
    }
}

module.exports = {
    cadastrarUsuario
}
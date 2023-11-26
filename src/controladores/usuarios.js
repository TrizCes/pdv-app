const knex = require("../utilitarios/conexao");
const { userData } = require("../intermediarios/autenticacao")


const detalharUsuario = async (req, res) => {
    try {

        const usuarioId = userData.id;

        if (!usuarioId) {
            return res.status(401).json({ mensagem: 'Usuário não autenticado' });
        }

        const usuario = await knex('usuarios').select('nome', 'email').where({ id: usuarioId }).first();

        return res.status(200).json(usuario);
    } catch (error) {
        return res.status(400).json({ mensagem: 'Erro interno no servidor' });
    }
};

module.exports = {
    detalharUsuario
};

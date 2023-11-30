const knex = require("../utilitarios/conexao");
const { hash } = require('bcrypt');

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const usuarioJaExiste = await knex('usuarios').where({ email }).first();

    if (usuarioJaExiste) {
      return res.status(400).json('E-mail já está cadastrado!');
    }

    const senhaCriptografada = await hash(senha, 10);

    const novoUsuario = await knex('usuarios').insert({ nome, email, senha: senhaCriptografada }).returning('*');

    if (!novoUsuario || novoUsuario.length === 0) {
      return res.status(400).json('O usuário não foi cadastrado.');
    }

    const { senha: _, ...dadosUsuario } = novoUsuario[0];

    return res.status(201).json(dadosUsuario);
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
};

const atualizarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;
  const { id } = req.usuario;

  try {
    const usuarioJaExiste = await knex('usuarios').where({ email }).first();

    if (usuarioJaExiste && usuarioJaExiste.id !== id) {
      return res.status(400).json('E-mail já está cadastrado!');
    }

    const senhaCriptografada = await hash(senha, 10);

    const usuarioAtualizado = await knex('usuarios')
      .where({ id: req.usuario.id })
      .update({ nome, email, senha: senhaCriptografada });

    if (!usuarioAtualizado) {
      return res.status(400).json('O usuario não foi atualizado');
    }

    return res.status(200).json('Usuario foi atualizado com sucesso.');
  } catch (error) {
    return res.status(400).json({ mensagem: 'Erro interno no servidor' });
  }
};

const detalharUsuario = async (req, res) => {
  try {

    const usuarioId = req.usuario.id;

    if (!usuarioId) {
      return res.status(401).json({ mensagem: 'Usuário não autenticado' });
    }

    const usuario = await knex('usuarios').select('id', 'nome', 'email').where({ id: usuarioId }).first();

    return res.status(200).json(usuario);
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
};

module.exports = {
  cadastrarUsuario,
  atualizarUsuario,
  detalharUsuario
}

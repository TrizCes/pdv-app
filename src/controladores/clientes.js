
const knex = require("../utilitarios/conexao");

const cadastrarCliente = async (req, res) => {
  const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;

  try {
    const clienteJaExiste = await knex('clientes')
    .where('email', email)
    .orWhere('cpf', cpf)
    .first();

    if (clienteJaExiste) {
      return res.status(400).json('Cliente já está cadastrado!');
    }

    const novoCliente = await knex('clientes').insert({ nome, email, cpf, cep, rua, numero, bairro, cidade, estado}).returning('*');

    if (!novoCliente || novoCliente.length === 0) {
      return res.status(400).json('O cliente não foi cadastrado.');
    }

    return res.status(201).json(novoCliente);
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
};

module.exports = {
    cadastrarCliente
}
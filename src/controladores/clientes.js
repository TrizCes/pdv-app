const knex = require('../utilitarios/conexao');

const cadastrarCliente = async (req, res) => {
  const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;

  try {
    const clienteJaExiste = await knex('clientes').where('email', email).orWhere('cpf', cpf).first();

    if (clienteJaExiste) {
      return res.status(400).json('Cliente já está cadastrado!');
    }

    const novoCliente = await knex('clientes')
      .insert({ nome, email, cpf, cep, rua, numero, bairro, cidade, estado })
      .returning('*');

    if (!novoCliente || novoCliente.length === 0) {
      return res.status(400).json('O cliente não foi cadastrado.');
    }

    return res.status(201).json(novoCliente);
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
};

const editarDadosDoCliente = async (req, res) => {
  const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;
  const { id } = req.params;

  try {
    const clienteExistente = await knex('clientes').where({ id }).first();
    if (!clienteExistente) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado.' });
    }

    if (!nome || !email || !cpf) {
      return res.status(400).json({ mensagem: 'Os campos nome, email e cpf são obrigatórios.' });
    }

    const clienteComMesmoEmail = await knex('clientes').where({ email }).first();
    if (clienteComMesmoEmail && clienteComMesmoEmail.id !== id) {
      return res.status(400).json('E-mail já está cadastrado!');
    }

    const clienteComMesmoCPF = await knex('clientes').where({ cpf }).first();
    if (clienteComMesmoCPF && clienteComMesmoCPF.id !== id) {
      return res.status(400).json('CPF já está cadastrado!');
    }

    const clienteAtualizado = await knex('clientes')
      .where({ id })
      .update({ nome, email, cpf, cep, rua, numero, bairro, cidade, estado });

    if (!clienteAtualizado) {
      return res.status(400).json({ mensagem: 'O cliente não foi atualizado.' });
    }

    return res.status(200).json({ mensagem: 'Cliente foi atualizado com sucesso.' });
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno no servidor', erro: error.message });
  }
};

const listarClientes = async (req, res) => {
  try {
    const clientes = await knex('clientes').select('*');

    return res.status(200).json(clientes);
  } catch (error) {

    return res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
};

const detalharCliente = async (req, res) => {
  const { id } = req.params;

  try {
    const clienteExiste = await knex('clientes').select('*').where({ id }).first();

    if (!clienteExiste) {
      return res.status(404).json({ mensagem: 'O cliente não foi encontrado!' });
    }

    return res.status(200).json(clienteExiste);
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno do servidor!' });
  }
};

module.exports = {
  cadastrarCliente,
  editarDadosDoCliente,
  listarClientes,
  detalharCliente,
};

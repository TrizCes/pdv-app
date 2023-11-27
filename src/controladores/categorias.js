const knex = require('../utilitarios/conexao.js');

const listarCategorias = async (req, res) => {
  try {
    const categorias = await knex('categorias').select('*');
    return res.status(200).json(categorias);
  } catch (erro) {
    console.log(erro.message)
    return res.status(500).json({ mensagem: 'Erro ao carregar as categorias' });
  }
};

module.exports = listarCategorias;

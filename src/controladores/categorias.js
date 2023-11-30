const knex = require('../utilitarios/conexao.js');

const listarCategorias = async (req, res) => {
  try {
    const categorias = await knex('categorias').select('*');
    return res.status(200).json(categorias);
  } catch (erro) {
<<<<<<< HEAD
    return res.status(500).json({ mensagem: 'Erro ao carregar as categorias' });
=======
    return res.status(500).json({ mensagem: "Erro ao carregar categorias" });
>>>>>>> 0fe418ec9d1d1e3a194aaefe38e9e8f1b6afc6bc
  }
};

module.exports = listarCategorias;

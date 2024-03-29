const knex = require('../utilitarios/conexao');
const { uploadArquivo, excluirArquivo } = require('../servicos/armazenamento');
const { logger } = require('../utilitarios/conexao_nodemailer');

const cadastrarProduto = async (req, res) => {
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
  try {
    const produtoJaExiste = await knex('produtos').where({ descricao }).first();
    if (produtoJaExiste) {
      return res.status(400).json('Produto já está cadastrado!');
    }

    let produto_imagem;

    if (req.file) {
      try {
        const resultadoUpload = await uploadArquivo(`${req.file.originalname}`, req.file.buffer, req.file.mimetype);
        produto_imagem = resultadoUpload;
      } catch (uploadError) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor durante o upload da imagem.' });
      }
    }

    const produto = await knex('produtos')
      .insert({
        descricao,
        quantidade_estoque,
        valor,
        categoria_id,
        produto_imagem,
      })
      .returning('*');

    if (produto.rowCount === 0) {
      return res.status(400).json('O produto não foi cadastrado');
    }

    return res.status(201).json(produto[0]);
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno do servidor!' });
  }
};

const editarDadosDoProduto = async (req, res) => {
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
  const { id } = req.params;

  try {
    const produtoExiste = await knex('produtos').where({ id }).first();

    if (!produtoExiste) {
      return res.status(404).json({ mensagem: 'Produto não encontrado!' });
    }

    const categoriaExiste = await knex('categorias').where({ id: categoria_id }).first();

    if (!categoriaExiste) {
      return res.status(404).json({ mensagem: 'Categoria não encontrada!' });
    }

    let produto_imagem;

    if (req.file) {
      try {
        const urlArquivoImagem = produtoExiste.produto_imagem;
        await excluirArquivo(urlArquivoImagem);
        
        const resultadoUpload = await uploadArquivo(`${req.file.originalname}`, req.file.buffer, req.file.mimetype);

        produto_imagem = resultadoUpload;
      } catch (uploadError) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor durante o upload da imagem.' });
      }
    }

    const produtoAtualizado = await knex('produtos')
      .update({
        descricao,
        quantidade_estoque,
        valor,
        categoria_id,
        produto_imagem,
      })
      .where({ id })
      .returning('*');

    if (!produtoAtualizado || produtoAtualizado.length === 0) {
      return res
        .status(400)
        .json({ mensagem: 'Não foi possível atualizar os dados do produto. Por favor, tente novamente!' });
    }

    return res.status(200).json({ mensagem: 'Produto atualizado com sucesso!' });
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno do servidor!' });
  }
};

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

const detalharProduto = async (req, res) => {
  const { id } = req.params;

  try {
    const produtoExiste = await knex('produtos').select('*').where({ id }).first();

    if (!produtoExiste) {
      return res.status(404).json({ mensagem: 'Produto não encontrado!' });
    }

    return res.status(200).json(produtoExiste);
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno do servidor!' });
  }
};

const excluirProduto = async (req, res) => {
  const { id } = req.params;
  try {
    const produtoIdExiste = await knex('produtos').where({ id }).first();

    if (!produtoIdExiste) {
      return res.status(404).json({ mensagem: 'Nenhum produto encontrado para o ID informado.' });
    }

    const produtoPedido = await knex('pedido_produtos').where({ produto_id: id }).first();

    if (produtoPedido) {
      return res
        .status(404)
        .json({ mensagem: 'Não foi possível excluir o produto. Ele está vinculado a um ou mais pedidos.' });
    }

    const produtoExcluido = await knex('produtos').delete('*').where({ id });
    const urlArquivoImagem = produtoExcluido[0].produto_imagem;

    await excluirArquivo(urlArquivoImagem);

    return res.status(200).json({ mensagem: 'Produto excluído com sucesso.' });
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
};

module.exports = {
  cadastrarProduto,
  editarDadosDoProduto,
  listarProdutos,
  detalharProduto,
  excluirProduto,
};

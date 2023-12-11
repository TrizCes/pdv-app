const express = require('express');
const multer = require('./intermediarios/multer')

const { atualizarUsuario, cadastrarUsuario, detalharUsuario } = require('./controladores/usuarios.js');
const verificarLogin = require('./intermediarios/autenticacao.js');
const validarCorpoRequisicao = require('./intermediarios/validarCorpoRequisicao.js');
const schemaUsuario = require('./validacoes/schemaUsuario.js');
const schemaLogin = require('./validacoes/schemaLogin.js');
const { login } = require('./controladores/login.js');
const listarCategorias = require('./controladores/categorias.js');
const {
  cadastrarProduto,
  editarDadosDoProduto,
  listarProdutos,
  detalharProduto,
  excluirProduto,
} = require('./controladores/produtos.js');
const schemaProduto = require('./validacoes/schemaProduto.js');
const schemaCliente = require('./validacoes/schemaClientes.js');
const {
  cadastrarCliente,
  editarDadosDoCliente,
  listarClientes,
  detalharCliente,
} = require('./controladores/clientes.js');
const schemaPedido = require('./validacoes/schemaPedido.js');
const { cadastrarPedido, listarPedidos } = require('./controladores/pedidos.js');


const rotas = express();

rotas.get('/categoria', listarCategorias);
rotas.post('/usuario', validarCorpoRequisicao(schemaUsuario), cadastrarUsuario);

rotas.post('/login', validarCorpoRequisicao(schemaLogin), login);

rotas.use(verificarLogin);

rotas.put('/usuario', validarCorpoRequisicao(schemaUsuario), atualizarUsuario);
rotas.get('/usuario', detalharUsuario);

rotas.post('/produto', multer.single('produto_imagem'), validarCorpoRequisicao(schemaProduto), cadastrarProduto);
rotas.put('/produto/:id', multer.single('produto_imagem'), validarCorpoRequisicao(schemaProduto), editarDadosDoProduto);
rotas.get('/produto', listarProdutos);
rotas.get('/produto/:id', detalharProduto);
rotas.delete('/produto/:id', excluirProduto);

rotas.post('/cliente', validarCorpoRequisicao(schemaCliente), cadastrarCliente);
rotas.put('/cliente/:id', validarCorpoRequisicao(schemaCliente), editarDadosDoCliente);
rotas.get('/cliente', listarClientes);
rotas.get('/cliente/:id', detalharCliente);

rotas.post('/pedido', validarCorpoRequisicao(schemaPedido), cadastrarPedido);
rotas.get('/pedido', listarPedidos);

module.exports = rotas;

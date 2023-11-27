const express = require('express');
const { atualizarUsuario, cadastrarUsuario, detalharUsuario } = require('./controladores/usuarios');
const verificarLogin = require('./intermediarios/autenticacao.js');
const validarCorpoRequisicao = require('./intermediarios/validarCorpoRequisicao.js');
const schemaUsuario = require('./validacoes/schemaUsuario');
const { login } = require('./controladores/login');
const listarCategorias = require('./controladores/categorias.js');

const rotas = express();

rotas.get('/categoria', listarCategorias);
rotas.post('/usuario', validarCorpoRequisicao(schemaUsuario), cadastrarUsuario);

rotas.post('/login', login);

rotas.use(verificarLogin);

rotas.put('/usuario', validarCorpoRequisicao(schemaUsuario), atualizarUsuario);

rotas.get('/usuario', verificarLogin, detalharUsuario)

module.exports = rotas;

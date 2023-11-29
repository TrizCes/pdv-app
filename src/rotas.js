const express = require('express');
const { atualizarUsuario, cadastrarUsuario, detalharUsuario } = require('./controladores/usuarios.js');
const verificarLogin = require('./intermediarios/autenticacao.js');
const validarCorpoRequisicao = require('./intermediarios/validarCorpoRequisicao.js');
const schemaUsuario = require('./validacoes/schemaUsuario.js');
const schemaLogin = require('./validacoes/schemaLogin.js');
const { login } = require('./controladores/login.js');
const listarCategorias = require('./controladores/categorias.js');

const rotas = express();

rotas.get('/categoria', listarCategorias);
rotas.post('/usuario', validarCorpoRequisicao(schemaUsuario), cadastrarUsuario);

rotas.post('/login', validarCorpoRequisicao(schemaLogin), login);

rotas.use(verificarLogin);

rotas.put('/usuario', validarCorpoRequisicao(schemaUsuario), atualizarUsuario);

rotas.get('/usuario', verificarLogin, detalharUsuario);

module.exports = rotas;

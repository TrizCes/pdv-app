const express = require('express');
const { cadastrarUsuario } = require('./controladores/usuarios');
const validarCorpoRequisicao = require('./intermediarios/validarCorpoRequisicao.js')
const schemaUsuario = require('./validacoes/schemaUsuario');
const { login } = require('./controladores/login');
const listarCategorias = require('./controladores/categorias.js');
const { detalharUsuario } = require('./controladores/usuarios.js');
const verificarLogin = require('./intermediarios/autenticacao.js');

const rotas = express();

rotas.get('/categoria', listarCategorias);
rotas.post('/usuario', validarCorpoRequisicao(schemaUsuario), cadastrarUsuario);

rotas.post("/login", login);

rotas.get('/usuario', verificarLogin, detalharUsuario)

module.exports = rotas;






const express = require('express');
const listarCategorias = require('./controladores/categorias.js');
const { detalharUsuario } = require('./controladores/usuarios.js');
const verificarLogin = require('./intermediarios/autenticacao.js');

const rotas = express();

rotas.get('/categoria', listarCategorias);

rotas.get('/usuario', verificarLogin, detalharUsuario)

module.exports = rotas;

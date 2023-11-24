const express = require('express');
const listarCategorias = require('./controladores/categorias.js');

const rotas = express();

rotas.get('/categoria', listarCategorias);

module.exports = rotas;

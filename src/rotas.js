const express = require('express');
const { atualizarUsuario } = require('./controladores/usuarios');

const rotas = express();

rotas.put('/usuario', atualizarUsuario);

module.exports = rotas;

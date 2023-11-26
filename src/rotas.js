const express = require('express');
const { cadastrarUsuario } = require('./controladores/usuarios');
const schemaUsuario = require('./validacoes/schemaUsuario');

const rotas = express();

rotas.post('/usuario', validarCorpoRequisicao(schemaUsuario), cadastrarUsuario);

module.exports = rotas;

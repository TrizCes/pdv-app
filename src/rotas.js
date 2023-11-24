const express = require('express');
<<<<<<< HEAD
const { login } = require('./controladores/login');

const rotas = express();





rotas.post("/login", login);

=======
const listarCategorias = require('./controladores/categorias.js');

const rotas = express();

rotas.get('/categoria', listarCategorias);
>>>>>>> 071f7cd7d133599f876e697baae753f2983944b5

module.exports = rotas;






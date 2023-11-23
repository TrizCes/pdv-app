require('dotenv').config();
const express = require('express');
const rotas = require('./rotas.js');

const porta = process.env.PORTA || 3000;

const app = express();

app.use(express.json());
app.use(rotas);

app.listen(porta, console.log(`╰(*°▽°*)╯ Conectado a porta ${porta}`));

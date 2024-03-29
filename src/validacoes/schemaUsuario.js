const joi = require('joi');

const schemaUsuario = joi.object({
  nome: joi.string().required().messages({
    'any.required': 'O campo nome é obrigatório!',
    'string.empty': 'É necessário informar um nome.',
  }),

  email: joi.string().email().required().messages({
    'any.required': 'O campo email é obrigatório!',
    'string.empty': 'É necessário informar um email.',
    'string.email': 'O campo email precisa ter um formato válido.',
  }),

  senha: joi.string().min(5).required().messages({
    'any.required': 'O campo senha é obrigatório!',
    'string.empty': 'É necessário informar uma senha.',
    'string.min': 'A senha precisa conter, no mínimo, 5 caracteres.',
  }),
});

module.exports = schemaUsuario;

const joi = require('joi');

const schemaLogin = joi.object({
  email: joi.string().email().required().messages({
    'any.required': 'O campo email é obrigatório',
    'string.empty': 'É necessário informar um email.',
    'string.email': 'Deve ser informado um email válido',
  }),

  senha: joi.string().required().messages({
    'any.required': 'O campo senha é obrigatório',
    'string.empty': 'É necessário informar uma senha.',
  }),
});

module.exports = schemaLogin;

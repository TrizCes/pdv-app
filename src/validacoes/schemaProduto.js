const joi = require('joi');

const schemaProduto = joi.object({
  descricao: joi.string().required().messages({
    'any.required': 'O campo descrição é obrigatório',
    'string.empty': 'É necessário informar a descrição do produto.',
  }),

  quantidade_estoque: joi.number().integer().min(0).required().messages({
    'any.required': 'O campo quantidade_estoque é obrigatório',
    'number.base': 'É necessário informar a quantidade de estoque',
  }),
  valor: joi.number().integer().positive().required().messages({
    'any.required': 'O campo valor é obrigatório',
    'number.base': 'É necessário informar o valor do produto.',
  }),
  categoria_id: joi.number().integer().required().messages({
    'any.required': 'O campo categoria é obrigatório',
    'number.base': 'É necessário informar a categoria do produto.',
  }),
});

module.exports = schemaProduto;
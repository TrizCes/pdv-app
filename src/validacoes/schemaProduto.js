const joi = require('joi');

const schemaProduto = joi.object({
  descricao: joi.string().required().messages({
    'any.required': 'O campo descrição é obrigatório',
    'string.empty': 'É necessário informar a descrição do produto.',
  }),

  quantidade_estoque: joi.number().integer().min(0).required().messages({
    'any.required': 'O campo quantidade_estoque é obrigatório',
    'number.base': 'É necessário informar a quantidade de estoque',
    'number.integer': 'A quantidade do produto deve ser um número inteiro',
    'number.min': 'A quantidade do produto deve ser maior ou igual a zero',
  }),
  valor: joi.number().integer().positive().required().messages({
    'any.required': 'O campo valor é obrigatório',
    'number.base': 'É necessário informar o valor do produto.',
    'number.integer': 'O valor do produto deve ser um número inteiro',
    'number.positive': 'O valor do produto deve ser um número positivo',
  }),
  categoria_id: joi.number().integer().required().messages({
    'any.required': 'O campo categoria é obrigatório',
    'number.base': 'É necessário informar a categoria do produto.',
    'number.integer': 'A categoria do produto deve ser um número inteiro',
  }),
});

module.exports = schemaProduto;


const joi = require('joi');

const schemaPedido = joi.object({
  cliente_id: joi.number().integer().required().messages({
    'any.required': 'O campo cliente_id é obrigatório',
    'number.base': 'É necessário informar um número de cliente_id',
    'number.integer': 'O número do cliente_id deve ser um número inteiro',
  }),
  observacao: joi.string().messages({
    'any.required': 'O campo observação é obrigatório',
    'string.empty': 'É necessário informar uma observação.',
  }),
  pedido_produtos: joi.array()
    .items(joi.object({
      produto_id: joi.number().integer().required().messages({
        'any.required': 'O campo produto_id é obrigatório',
        'number.base': 'É necessário informar um número para produto_id',
        'number.integer': 'O número do produto_id deve ser um número inteiro',
        'string.empty': 'É necessário informar um número para produto_id.',
      }),
      quantidade_produto: joi.number().integer().min(1).required().messages({ 
      'any.required': 'O campo quantidade_estoque é obrigatório',
      'number.base': 'É necessário informar a quantidade de estoque',
      'number.integer': 'A quantidade do produto deve ser um número inteiro',
      'number.min': 'A quantidade do produto deve ser maior do que zero',}),
    }))
    .min(1)
    .required().messages({
      'array.base': 'O campo pedido_produtos deve ser um array de objetos',
    }),
});

module.exports = schemaPedido;

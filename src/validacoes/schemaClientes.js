
const joi = require('joi');

const schemaCliente = joi.object({

    nome: joi.string().required().messages({
        'any.required': 'O campo nome é obrigatório!',
        'string.empty': 'É necessário informar um nome.'
    }),

    email: joi.string().email().required().messages({
        'any.required': 'O campo email é obrigatório!',
        'string.empty': 'É necessário informar um email.',
        'string.email': 'O campo email precisa ter um formato válido.'
    }),

    cpf: joi.string().max(11).min(11).required().messages({
        'any.required': 'O campo cpf é obrigatório!',
        'string.empty': 'É necessário informar um cpf.',
        'string.min': 'O cpf precisa conter 11 caracteres.',
        'string.max': 'O cpf precisa conter 11 caracteres.'
    }),
    cep: joi.string().required().messages({
        'any.required': 'O campo nome é obrigatório!',
        'string.empty': 'É necessário informar um cep.'
    }),
    rua: joi.string().required().messages({
        'any.required': 'O campo rua é obrigatório!',
        'string.empty': 'É necessário informar uma rua.'
    }),
    numero: joi.string().required().messages({
        'any.required': 'O campo numero é obrigatório!',
        'string.empty': 'É necessário informar o número da residência.'
    }),
    bairro: joi.string().required().messages({
        'any.required': 'O campo bairro é obrigatório!',
        'string.empty': 'É necessário informar o bairro.'
    }),
    cidade: joi.string().required().messages({
        'any.required': 'O campo cidade é obrigatório!',
        'string.empty': 'É necessário informar a cidade.'
    }),
    estado: joi.string().required().messages({
        'any.required': 'O campo estado é obrigatório!',
        'string.empty': 'É necessário informar o estado.'
    })

});

module.exports = schemaCliente;
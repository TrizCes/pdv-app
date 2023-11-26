const validarCorpoRequisicao = joiSchema => async (req, res, next) => {
    try {
        await joiSchema.validadeAsync(req.body);
        next();
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
};

module.exports = validarCorpoRequisicao;
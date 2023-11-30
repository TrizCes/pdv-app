require('dotenv').config();
const jwt = require("jsonwebtoken");
const knex = require("../utilitarios/conexao");


const verificarLogin = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ mensagem: "Não autorizado!" });
    }

    try {
        const token = authorization.split(" ")[1];
        
        const { id } = jwt.verify(token, process.env.senhaJwt);
       
        const usuario = await knex("usuarios").where("id", id).select("*");
        
        if (!usuario) {
            return res.status(401).json({ mensagem: "Usuario não encontrado!" });
        }

        const { senha, ...userData } = usuario[0];

        req.usuario = userData;

        next();

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor' });

    }
  
};



module.exports = verificarLogin;
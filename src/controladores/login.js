require('dotenv').config();
const bcrypt = require("bcrypt");
const knex = require("../utilitarios/conexao");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(500).json({ mensagem: "Todos os campos são obrigatórios!" });
    }

    try {
        const [usuario] = await knex("usuarios").where("email", email).select("*");

        if (!usuario) {
            return res.status(400).json({ mensagem: "Email ou senha inválida!" });
        }

        const { senha: senhaCriptografada, ...userData } = usuario;
        const senhaCorreta = await bcrypt.compare(senha, senhaCriptografada);

        if (!senhaCorreta) {
            return res.status(400).json({ mensagem: "Email ou senha inválida!" });
        }

        const token = jwt.sign({ id: userData.id }, process.env.senhaJwt, { expiresIn: "8h" });
        return res.json({
            usuario: userData,
            token
        });

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor!" });
    }
};

module.exports = {
    login
}

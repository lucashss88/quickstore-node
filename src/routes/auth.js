const express = require('express');
require('dotenv').config();
const AuthService = require("../services/authService");
const {authorize} = require("./middleware/auth");
const router = express.Router();


router.post('/registrar', async (req, res) => {
    try {
        const { email, senha, nome, role } = req.body;
        if (!req.body || !email || !senha) {
            return res.status(400).json({
                error: 'Requisição inválida. Certifique-se de enviar email, senha e nome no corpo da requisição.',
            });
        }
        const result = await AuthService.registrar(email, senha, nome, role);
        res.json(result);
    } catch (err) {
        res.status(err.statusCode || 500).json({ msg: err.message });
    }
});

// Login de usuário
router.post('/login', async (req, res) => {
    try{
        const { email, senha } = req.body;
        if (!req.body || !email || !senha) {
            return res.status(400).json({
                error: 'Requisição inválida. Certifique-se de enviar email e senha no corpo da requisição.',
            });
        }
        const result = await AuthService.login(email, senha);
        res.json(result);
    } catch(err) {
        res.status(err.statusCode || 500).send({msg: err.message});
    }
});

router.post('/logout', (req, res) => {
    return res.status(200).json({ msg: 'Sessão encerrada no cliente!' });
});

router.post('/admin/criar-usuario', authorize(['admin']), async (req, res) => {

});

module.exports = router;
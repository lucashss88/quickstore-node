const express = require('express');
require('dotenv').config();
const AuthService = require("../services/authService");
const router = express.Router();


router.post('/registrar', async (req, res) => {
    try {
        const { email, password, nome } = req.body;
        if (!req.body || !email || !password) {
            return res.status(400).json({
                error: 'Requisição inválida. Certifique-se de enviar email, password e nome no corpo da requisição.',
            });
        }
        const result = await AuthService.registrar(email, password, nome);
        res.json(result);
    } catch (err) {
        res.status(err.statusCode || 500).json({ msg: err.message });
    }
});

// Login de usuário
router.post('/login', async (req, res) => {
    try{
        const { email, password } = req.body;
        if (!req.body || !email || !password) {
            return res.status(400).json({
                error: 'Requisição inválida. Certifique-se de enviar email e password no corpo da requisição.',
            });
        }
        const result = await AuthService.login(email, password);
        res.json(result);
    } catch(err) {
        res.status(err.statusCode || 500).send({msg: err.message});
    }
});

router.post('/logout', (req, res) => {
    return res.status(200).json({ msg: 'Sessão encerrada no cliente!' });
});

module.exports = router;
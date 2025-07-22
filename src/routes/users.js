const {auth, authorize} = require("./middleware/auth");
const express = require('express');
const router = express.Router();
const usuarioService = require('../services/usuarioService');
const AuthService = require("../services/authService");

router.use(auth);

router.get('/me', async (req, res) => {
    const { id } = req.user;
    try {
        const user = await usuarioService.buscarPorId(id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json({ user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.put('/me', async (req, res) => {
    const { nome, email } = req.body;
    const { id } = req.user;
    try {
        const user = await usuarioService.buscarPorId(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const usuarioAtualizado = await usuarioService.atualizar(id, nome, email );
        res.json({ user: usuarioAtualizado });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/admin/criar-admin', auth, authorize(['admin']), async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        if (!req.body || !email || !senha) {
            return res.status(400).json({
                error: 'Requisição inválida. Certifique-se de enviar email, senha e nome no corpo da requisição.',
            });
        }
        const role = 'admin';
        const result = await AuthService.registrar(email, senha, nome, role);
        res.json(result);
    } catch (err) {
        res.status(err.statusCode || 500).json({ msg: err.message });
    }
});

router.get('/admin/usuarios', auth, authorize(['admin']), async (req, res) => {
    try {
        const usuarios = await usuarioService.todosUsuarios();
        res.json(usuarios);
    } catch (err) {
        res.status(err.statusCode || 500).json({ msg: err.message });
    }
});

module.exports = router;

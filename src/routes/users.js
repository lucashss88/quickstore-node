const {auth} = require("./middleware/auth");
const express = require('express');
const router = express.Router();
const usuarioService = require('../services/usuarioService');

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

module.exports = router;

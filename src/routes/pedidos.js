const express = require('express');
const router = express.Router();
const {auth} = require('./middleware/auth');
const pedidoService = require('../services/pedidoService');

router.use(auth);

router.post('/', async (req, res) => {
    try {
        const pedido = await pedidoService.criarPedido(req.user.id);
        res.status(201).json(pedido);
    } catch (err) {
        console.error("Erro detalhado: ", err);
        res.status(400).json({ error: 'Erro ao criar pedido' });
    }
});

router.get('/', async (req, res) => {
    try {
        const pedidos = await pedidoService.listarPedidos(req.user.id);
        res.json(pedidos);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao listar pedidos' });
    }
});

router.post('/:id/aceitar', async (req, res) => {
    try {
        const pedido = await pedidoService.aceitarPedido(req.params.id, req.user.id);
        res.json(pedido);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao aceitar pedido' });
    }
})

router.post('/:id/finalizar', async (req, res) => {
    try {
        const pedido = await pedidoService.finalizarPedido(req.params.id, req.user.id);
        res.json(pedido);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao aceitar pedido' });
    }
})

router.post('/:id/pagar', async (req, res) => {
    try {
        const pedido = await pedidoService.pagarPedido(req.params.id, req.user.id);
        res.json(pedido);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao aceitar pedido' });
    }
})

router.post('/:id/enviar', async (req, res) => {
    try {
        const pedido = await pedidoService.enviarPedido(req.params.id, req.user.id);
        res.json(pedido);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao aceitar pedido' });
    }
})

router.post('/:id/cancelar', async (req, res) => {
    try {
        const pedido = await pedidoService.cancelarPedido(req.params.id, req.user.id);
        res.json(pedido);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao aceitar pedido' });
    }
})

module.exports = router;
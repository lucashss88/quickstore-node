const express = require('express');
const router = express.Router();
const {auth, authorize} = require('./middleware/auth');
const pedidoService = require('../services/pedidoService');

router.use(auth);

router.post('/', authorize('usuario'), async (req, res) => {
    try {
        const pedido = await pedidoService.criarPedido(req.user.id);
        res.status(201).json(pedido);
    } catch (err) {
        console.error("Erro detalhado: ", err);
        res.status(400).json({ error: 'Erro ao criar pedido' });
    }
});

router.get('/admin', authorize('admin'), async (req, res) => {
    try {
        const pedidos = await pedidoService.listarPedidosByAdmin();
        res.json(pedidos);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao listar pedidos por administrador' });
    }
});

router.get('/', authorize('usuario'), async (req, res) => {
    try {
        const pedidos = await pedidoService.listarPedidos(req.user.id);
        res.json(pedidos);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao listar pedidos' });
    }
});

router.get('/:id', authorize('usuario'), async (req, res) => {
    try {
        const pedidoId = req.params.id;
        const pedido = await pedidoService.listarPedidosPorId(pedidoId);
        res.json(pedido);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao listar pedidos' });
    }
});

//ACEITAR
router.post('/:id/aceitar', authorize('admin'), async (req, res) => {
    try {
        const usuarioId = parseInt(req.user.id);
        console.log(`Usuário autenticado: ${usuarioId}`);
        const pedido = await pedidoService.aceitarPedido(req.params.id, usuarioId);
        res.status(200).json({ message: 'Pedido aceito com sucesso!', pedido });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao aceitar pedido' });
    }
})

//FINALIZAR
router.post('/:id/finalizar', authorize('admin'), async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const pedido = await pedidoService.finalizarPedido(req.params.id, usuarioId);
        res.status(200).json({ message: 'Pedido finalizado com sucesso!', pedido });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao aceitar pedido' });
    }
})

//PAGAR
router.post('/:id/pagar', authorize('usuario'), async (req, res) => {
    try {
        const { numeroCartao } = req.body; // Certifique-se de que este dado está vindo no frontend
        if (!numeroCartao) {
            return res.status(400).json({ error: 'Número do Cartão é obrigatório.' });
        }
        const usuarioId = req.user.id;
        const pedido = await pedidoService.pagarPedido(req.params.id, usuarioId, numeroCartao);
        res.status(200).json({message: 'Pedido pago com sucesso!', pedido});
    } catch (err) {
        res.status(500).json({ error: 'Erro ao aceitar pedido' });
    }
})

//ENVIAR
router.post('/:id/enviar', authorize('admin'), async (req, res) => {
    try {
        const usuarioId = parseInt(req.user.id);
        const pedido = await pedidoService.enviarPedido(req.params.id, usuarioId);
        res.status(200).json({message: 'Pedido enviado com sucesso!', pedido});
    } catch (err) {
        res.status(500).json({ error: 'Erro ao aceitar pedido' });
    }
})

//CANCELAR
router.post('/:id/cancelar', authorize(['admin', 'usuario']), async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const pedido = await pedidoService.cancelarPedido(req.params.id, usuarioId);
        res.status(200).json({message: 'Pedido cancelado com sucesso!', pedido});
    } catch (err) {
        res.status(500).json({ error: 'Erro ao aceitar pedido' });
    }
})

module.exports = router;
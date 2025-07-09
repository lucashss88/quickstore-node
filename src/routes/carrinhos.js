const express = require('express');
const router = express.Router();
const {auth, authorize} = require('./middleware/auth');
const carrinhoService = require('../services/carrinhoService');
const carrinhoCalculoService = require('../services/carrinhoCalculoService');
const itemCarrinhoService = require('../services/itemCarrinhoService');

router.use(auth);

router.get('/meu-carrinho', authorize('usuario'), async (req, res) => {
    try{
        const carrinho = await carrinhoService.buscarCarrinhoPorId(req.user.id);
        const items = await itemCarrinhoService.listarTodos(carrinho.id);
        const valorTotal = await carrinhoCalculoService.calcularValorTotal(carrinho.id);

        res.json({ id: carrinho.id, valorTotal, items });
    } catch(err) {
        res.status(500).json({msg: err.message});
        console.error(err.message);
    }
});

router.post('/meu-carrinho/items', authorize('usuario'), async (req, res) => {
    try{
        const {produtoId, quantidade} = req.body;
        const carrinho = await carrinhoService.adicionarProdutoAoCarrinho(req.user.id, produtoId, quantidade);
        res.json(carrinho);
    } catch(err) {
        res.status(500).json({msg: err.message});
    }
});

router.put('/meu-carrinho/items/:produtoId', authorize('usuario'), async (req, res) => {
    const {produtoId} = req.params;
    const {quantidade} = req.body;

    try {
        if (!quantidade || quantidade <= 0) {
            return res
                .status(400)
                .json({ msg: 'Quantidade inválida ou ausente. Deve ser um número maior que zero.' });
        }

        const carrinho = await carrinhoService.buscarCarrinhoPorId(req.user.id);
        console.log("Carrinho encontrado no PUT: ", carrinho);
        if(!carrinho) {
            return res.status(404).json({msg: 'Carrinho não encontrado'});
        }

        const itemCarrinho = await itemCarrinhoService.buscarItemCarrinhoPorId(produtoId, carrinho);
        console.log("ItemCarrinho encontrado no PUT: ", itemCarrinho);
        if(!itemCarrinho) {
            return res.status(404).json({msg: 'Item não encontrado'});
        }

        await carrinhoService.atualizarQuantidadeDoItem(itemCarrinho, quantidade);

        const valorTotal = await carrinhoCalculoService.calcularValorTotal(carrinho.id);

        const items = await itemCarrinhoService.listarTodos(carrinho.id);
        res.json({
            id: carrinho.id,
            valorTotal,
            items
        });
    } catch (err) {
        res.status(500).json({msg: err.message});
    }
});

router.delete('/meu-carrinho/items/:produtoId', authorize('usuario'), async (req, res) => {
    const {produtoId} = req.params;
    const usuarioId = req.user.id;
    await carrinhoService.removerProdutoDoCarrinho(usuarioId, produtoId);
    const carrinho = await carrinhoService.buscarCarrinhoPorId(usuarioId);

    const valorTotal = await carrinhoCalculoService.calcularValorTotal(carrinho.id);
    const items = await itemCarrinhoService.listarTodos(carrinho.id);
    res.json({id: carrinho.id, valorTotal, items});
});

module.exports = router;
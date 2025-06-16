const express = require('express');
const ProdutoService = require('../services/ProdutoService');
const multer = require('multer');
const path = require('path');
const fs = require("node:fs");

const router = express.Router();

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
    try {
        const produtos = await ProdutoService.listarTodos();
        res.json(produtos);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao listar produtos' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const produto = await ProdutoService.buscarPorId(req.params.id);
        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        res.json(produto);
    } catch (err) {
        res.status(500).json({ err: 'Erro ao buscar produto' });
    }
});

router.post('/', async (req, res) => {
    try {
        const produto = await ProdutoService.criar(req.body);
        res.status(201).json(produto);
    } catch (err) {
        res.status(400).json({ err: 'Erro ao criar produto' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const produto = await ProdutoService.atualizar(req.params.id, req.body);
        res.json(produto);
    } catch (err) {
        res.status(400).json({ err: 'Erro ao atualizar produto' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await ProdutoService.deletar(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(400).json({ err: 'Erro ao deletar produto' });
    }
});

router.post('/upload', upload.single('imagem'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    }
    const url = path.join('/uploads', req.file.filename).replace(/\\/g, '/');
    res.status(201).json({ url });
});

module.exports = router;
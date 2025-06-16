const {Produto} = require("../../models");
const IProdutoRepository = require("./interfaceProdutoRepository");

class SequelizeProdutoRepository extends IProdutoRepository{
    async listarTodos(){
        return await Produto.findAll();
    }
    async buscarProdutoPorId(produtoId){
        return await Produto.findByPk(produtoId);
    }
    async criar(produto){
        return Produto.create(produto);
    }
    async atualizar(id, produto){
        const produtoAtualizado = await this.buscarProdutoPorId(id);
        if (!produtoAtualizado) {
            throw new Error("Produto não encontrado");
        }
        return await produtoAtualizado.update(produto);
    }
    async deletar(id){
        const produtoDeletado = await Produto.findByPk(id);
        if (!produtoDeletado) {
            throw new Error("Produto não encontrado");
        }
        return await produtoDeletado.destroy();
    }
}

module.exports = SequelizeProdutoRepository;
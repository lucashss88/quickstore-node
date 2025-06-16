const SequelizeProdutoRepository = require("../repositories/produto/sequelizeProdutoRepository");

class ProdutoService {
    static produtoRepository = new SequelizeProdutoRepository();

    static async listarTodos() {
        try{
            return await this.produtoRepository.listarTodos();
        } catch(err) {
            console.log(err);
        }
    }

    static async buscarPorId(id) {
        return await this.produtoRepository.buscarProdutoPorId(id);
    }

    static async criar(produto) {
        return this.produtoRepository.criar(produto);
    }

    static async atualizar(id, produto) {
        return await this.produtoRepository.atualizar(id, produto);
    }

    static async deletar(id){
        return await this.produtoRepository.deletar(id);
    }
}

module.exports = ProdutoService;
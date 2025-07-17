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
        if (produto.imagemUrl) {
            produto.imagemUrl = produto.imagemUrl.replace(/\\/g, '/');
        }
        return this.produtoRepository.criar(produto);
    }

    static async atualizar(id, produto) {
        if (produto.imagemUrl) {
            produto.imagemUrl = produto.imagemUrl.replace(/\\/g, '/');
        }
        return await this.produtoRepository.atualizar(id, produto);
    }

    static async deletar(id){
        return await this.produtoRepository.deletar(id);
    }
}

module.exports = ProdutoService;
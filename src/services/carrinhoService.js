const SequelizeCarrinhoRepository = require("../repositories/carrinho/sequelizeCarrinhoRepository");
const SequelizeProdutoRepository = require("../repositories/produto/sequelizeProdutoRepository");
const SequelizeItemCarrinhoRepository = require("../repositories/itemCarrinho/sequelizeItemCarrinhoRepository");

class CarrinhoService {
    static produtoRepository = new SequelizeProdutoRepository();
    static itemCarrinhoRepository = new SequelizeItemCarrinhoRepository(CarrinhoService.produtoRepository);
    static carrinhoRepository = new SequelizeCarrinhoRepository(CarrinhoService.itemCarrinhoRepository, CarrinhoService.produtoRepository);

    static async buscarCarrinhoPorId(usuarioId){
        return await this.carrinhoRepository.buscarCarrinhoPorId(usuarioId);
    }
    static async adicionarProdutoAoCarrinho(usuarioId, produtoId, quantidade) {
        return await this.carrinhoRepository.adicionarProdutoAoCarrinho(usuarioId, produtoId, quantidade);
    };

    static async removerProdutoDoCarrinho(usuarioId, produtoId) {
        return await this.carrinhoRepository.removerProdutoDoCarrinho(usuarioId, produtoId);
    };

    static async atualizarQuantidadeDoItem(item, quantidade) {
        return await this.carrinhoRepository.atualizarQuantidadeDoItem(item, quantidade);
    }
}

module.exports = CarrinhoService;
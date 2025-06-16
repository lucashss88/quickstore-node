const SequelizeItemCarrinhoRepository = require("../repositories/itemCarrinho/sequelizeItemCarrinhoRepository");
const SequelizeProdutoRepository = require("../repositories/produto/sequelizeProdutoRepository");

class ItemCarrinhoService {
    static produtoRepository = new SequelizeProdutoRepository();
    static itemCarrinhoRepository = new SequelizeItemCarrinhoRepository(ItemCarrinhoService.produtoRepository);

    static async listarTodos(carrinhoId){
        return await this.itemCarrinhoRepository.listarTodos(carrinhoId);
    }

    static async buscarItemCarrinhoPorId(produtoId, carrinho){
        return await this.itemCarrinhoRepository.buscarItemCarrinhoPorId(produtoId, carrinho);
    }
}

module.exports = ItemCarrinhoService;
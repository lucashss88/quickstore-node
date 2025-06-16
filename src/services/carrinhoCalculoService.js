const SequelizeCarrinhoRepository = require("../repositories/carrinho/sequelizeCarrinhoRepository");
const SequelizeProdutoRepository = require("../repositories/produto/sequelizeProdutoRepository");
const SequelizeItemCarrinhoRepository = require("../repositories/itemCarrinho/sequelizeItemCarrinhoRepository");

class CarrinhoCalculoService {
    static produtoRepository = new SequelizeProdutoRepository();
    static itemCarrinhoRepository = new SequelizeItemCarrinhoRepository();
    static carrinhoRepository = new SequelizeCarrinhoRepository(CarrinhoCalculoService.itemCarrinhoRepository, CarrinhoCalculoService.produtoRepository);

    static async calcularValorTotal(carrinhoId){
        return await this.carrinhoRepository.calcularValorTotal(carrinhoId);
    }

}

module.exports = CarrinhoCalculoService;
const {ItemCarrinho, Produto} = require("../../models");
const IItemCarrinhoRepository = require("./interfaceItemCarrinhoRepository");

class SequelizeItemCarrinhoRepository extends IItemCarrinhoRepository{
    constructor(produtoRepository){
        super();
        this.produtoRepository = produtoRepository;
    }

    async criar(carrinho, produtoId, quantidade){
        try {
            const produto = await this.produtoRepository.buscarProdutoPorId(produtoId);
            return await ItemCarrinho.create({
                carrinhoId: carrinho.id,
                produtoId,
                quantidade,
                preco: quantidade * produto.preco,
            });
        } catch (error) {
            console.error("Erro ao criar item do carrinho:", error);
            throw error;
        }
    }

    async listarTodos(carrinhoId){
        try {
            const itens = await ItemCarrinho.findAll({
                where: { carrinhoId: carrinhoId },
                include: [Produto]
            });
            console.log("Itens: ", itens);
            return itens;
        } catch (error) {
            console.error("Erro ao listar itens do carrinho:", error);
            throw error;
        }
    }

    async atualizarQuantidadeEPreco(item, quantidade, produto){
        try {
            item.quantidade += quantidade;
            item.preco = item.quantidade * produto.preco;
            await item.save();
        } catch (error) {
            console.error("Erro ao atualizar quantidade do item:", error);
        }
    }

    async buscarItemCarrinhoPorId(produtoId, carrinho){
        try {
            return await ItemCarrinho.findOne({
                where: {carrinhoId: carrinho.id, produtoId},
                include: [Produto]
            });
        } catch (error) {
            console.error("Erro ao buscar item do carrinho por ID:", error);
            throw error;
        }
    }

    async deletar(carrinhoId, produtoId){
        try {
            return await ItemCarrinho.destroy({
                where: { carrinhoId, produtoId}
            });
        } catch (error) {
            console.error("Erro ao deletar item do carrinho:", error);
            throw error;
        }
    }

    async limparCarrinho(carrinho, options = {}){
        try {
            await ItemCarrinho.destroy(
                {
                    where: { carrinhoId: carrinho.id },
                    ...options
                }
            );
        } catch (error) {
            console.error("Erro ao limpar carrinho:", error);
            throw error;
        }
    }
}

module.exports = SequelizeItemCarrinhoRepository;
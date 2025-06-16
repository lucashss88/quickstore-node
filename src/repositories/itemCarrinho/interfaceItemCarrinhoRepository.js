class IItemCarrinhoRepository {
    async listarTodos(carrinhoId){ throw new Error('Método não implementado'); }
    async buscarItemCarrinhoPorId(produtoId, carrinho){ throw new Error('Método não implementado'); }
    async criar(carrinho, produtoId, quantidade){ throw new Error('Método não implementado'); }
    async deletar(carrinhoId, produtoId){ throw new Error('Método não implementado'); }
    async limparCarrinho(carrinho, options = {}){ throw new Error('Método não implementado'); }
    async atualizarQuantidadeEPreco(item, quantidade, produto){ throw new Error('Método não implementado'); }
}

module.exports = IItemCarrinhoRepository;
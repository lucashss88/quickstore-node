class ICarrinhoRepository {
    async buscarCarrinhoPorId(usuarioId){ throw new Error('Método não implementado'); }
    async adicionarProdutoAoCarrinho(usuarioId, produtoId, quantidade){ throw new Error('Método não implementado'); }
    async removerProdutoDoCarrinho(usuarioId, produtoId){ throw new Error('Método não implementado'); }
    async atualizarQuantidadeDoItem(item, quantidade){ throw new Error('Método não implementado'); }
    async calcularValorTotal(carrinhoId){ throw new Error('Método não implementado'); }
}

module.exports = ICarrinhoRepository;
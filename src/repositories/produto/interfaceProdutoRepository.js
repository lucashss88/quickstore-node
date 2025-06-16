class IProdutoRepository {
    async listarTodos(){ throw new Error('Método não implementado'); }
    async buscarProdutoPorId(produtoId){ throw new Error('Método não implementado'); }
    async criar(produto){ throw new Error('Método não implementado'); }
    async atualizar(id, produto){ throw new Error('Método não implementado'); }
    async deletar(id){ throw new Error('Método não implementado'); }
}

module.exports = IProdutoRepository;
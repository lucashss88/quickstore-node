class IPedidoRepository {
    async listarPorUsuario(usuarioId) { throw new Error('Método não implementado'); }
    async listarPorId(pedidoId){ throw new Error('Método não implementado'); }
    async criar(usuarioId) { throw new Error('Método não implementado'); }
    async editar() { throw new Error('Método não implementado'); }
    async deletar(pedidoId) { throw new Error('Método não implementado'); }
}

module.exports = IPedidoRepository;
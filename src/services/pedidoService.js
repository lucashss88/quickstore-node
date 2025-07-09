const SequelizePedidoRepository = require('../repositories/pedido/sequelizePedidoRepository');
const SequelizeItemPedidoRepository = require('../repositories/itemPedido/sequelizeItemPedidoRepository');
const SequelizeCarrinhoRepository = require('../repositories/carrinho/sequelizeCarrinhoRepository');
const SequelizeProdutoRepository = require('../repositories/produto/sequelizeProdutoRepository');
const SequelizeItemCarrinhoRepository = require('../repositories/itemCarrinho/sequelizeItemCarrinhoRepository');
class PedidoService {
    static produtoRepository = new SequelizeProdutoRepository();
    static itemCarrinhoRepository = new SequelizeItemCarrinhoRepository(PedidoService.produtoRepository);
    static carrinhoRepository = new SequelizeCarrinhoRepository(PedidoService.itemCarrinhoRepository, PedidoService.produtoRepository);
    static itemPedidoRepository = new SequelizeItemPedidoRepository();
    static pedidoRepository = new SequelizePedidoRepository(PedidoService.carrinhoRepository, PedidoService.itemPedidoRepository, PedidoService.itemCarrinhoRepository);

    static async criarPedido(usuarioId) {
        try {
            return await this.pedidoRepository.criar(usuarioId);
        } catch (err) {
            console.error(err);
        }
    }

    static async listarPedidos(usuarioId) {
        try{
            return await this.pedidoRepository.listarPorUsuario(usuarioId);
        } catch(err) {
            console.error(err);
        }
    }

    static async listarPedidosPorId(pedidoId) {
        try{
            return await this.pedidoRepository.listarPorId(pedidoId);
        } catch(err) {
            console.error(err);
        }
    }

    static async listarPedidosByAdmin(){
        try {
            return await this.pedidoRepository.listarPedidosByAdmin();
        } catch (e) {
            console.error(e);
        }
    }

    static async aceitarPedido(pedidoId, usuarioId) {
        try {
            if (!usuarioId) {
                throw new Error('Usuário não autenticado ou ID de usuário não fornecido.');
            }
            console.log("Usuário autenticado no serviço:", usuarioId);
            return await this.pedidoRepository.aceitar(pedidoId, usuarioId);
        } catch (err) {
            console.error("Erro ao aceitar o pedido (ID: ", pedidoId, "): ", err.message);
            throw new Error('Erro ao aceitar o pedido. Verifique se o ID ou Status estão corretos.');
        }
    }

    static async finalizarPedido(pedidoId, usuarioId) {
        try {
            return await this.pedidoRepository.finalizar(pedidoId, usuarioId);
        } catch (err) {
            console.error(err);
        }
    }

    static async cancelarPedido(pedidoId, usuarioId) {
        try {
            return await this.pedidoRepository.cancelar(pedidoId, usuarioId);
        } catch (err) {
            console.error(err);
        }
    }

    static async enviarPedido(pedidoId, usuarioId) {
        try {
            return await this.pedidoRepository.enviar(pedidoId, usuarioId);
        } catch (err) {
            console.error(err);
        }
    }

    static async pagarPedido(pedidoId, usuarioId, numeroCartao) {
        try {
            return await this.pedidoRepository.pagar(pedidoId, usuarioId, numeroCartao);
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = PedidoService;
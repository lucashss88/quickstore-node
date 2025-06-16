const IPedidoRepository = require("./interfacePedidoRepository");
const {Pedido, Produto, ItemPedido} = require("../../models");
const { sequelize } = require("../../config/database");
const debug = require('debug')('app:pedido');

class SequelizePedidoRepository extends IPedidoRepository {
    constructor(carrinhoRepository, itemPedidoRepository, itemCarrinhoRepository) {
        super();
        this.carrinhoRepository = carrinhoRepository;
        this.itemPedidoRepository = itemPedidoRepository;
        this.itemCarrinhoRepository = itemCarrinhoRepository;
    }

    async listarPorUsuario(usuarioId) {
        try {
            return await Pedido.findAll({
                where: { usuarioId },
                include: {
                    model: ItemPedido,
                    as: 'itens',
                    include: Produto
                },
                order: [['createdAt', 'DESC']]
            });
        } catch (error) {
            console.error("Erro ao listar pedidos por usuário:", error);
            throw error;
        }
    }
    async listarPorId(id) {
        try {
            return await Pedido.findByPk(id);
        } catch (error) {
            console.error("Erro ao listar pedido por ID:", error);
            throw error;
        }
    }
    async criar(usuarioId) {
        const carrinho = await this.carrinhoRepository.buscarCarrinhoPorId(usuarioId);
        debug("Carrinho encontrado: %O", carrinho);

        if (!carrinho || !carrinho.itens.length) {
            throw new Error("Carrinho vazio");
        }

        const total = await this.carrinhoRepository.calcularValorTotal(carrinho.id);
        console.log("Total: ",total);

        const t = await sequelize.transaction();
        try {
            const pedido = await Pedido.create(
                { usuarioId, valorTotal: total },
                {transaction: t}
            );

            for (const item of carrinho.itens){
                await this.itemPedidoRepository.criar(
                    pedido,
                    item,
                    { transaction: t }
                );
            }

            await this.itemCarrinhoRepository.limparCarrinho(
                carrinho,
                { transaction: t }
            );

            await t.commit();
            return pedido;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
    async deletar(pedidoId) {
        try {
            return await Pedido.destroy({
                where: { id: pedidoId }
            });
        } catch (error) {
            console.error("Erro ao deletar pedido:", error);
            throw error;
        }
    }

    async aceitar(pedidoId, usuarioId){
        try {
            const pedido = await this.listarPorId(pedidoId);
            if(!pedido || pedido.usuarioId !== usuarioId) {
                throw new Error('Pedido não encontrado ou não autorizado.');
            }

            if(pedido.status !== 'CRIADO') {
                throw new Error('Só é possível aceitar pedidos com Status "CRIADO".');
            }

            pedido.status = 'ACEITO';
            await pedido.save();
            return pedido;
        } catch (error) {
            console.error("Erro ao aceitar pedido:", error);
            throw error;
        }
    }

    async pagar(pedidoId, usuarioId){
        try {
            const pedido = await this.listarPorId(pedidoId);
            if(!pedido || pedido.usuarioId !== usuarioId) {
                throw new Error('Pedido não encontrado ou não autorizado.');
            }

            if(pedido.status !== 'ACEITO') {
                throw new Error('Só é possível pagar pedidos com Status "ACEITO".');
            }

            pedido.status = 'PAGO';
            await pedido.save();
            return pedido;
        } catch (error) {
            console.error("Erro ao pagar pedido:", error);
            throw error;
        }
    }

    async enviar(pedidoId, usuarioId){
        try {
            const pedido = await this.listarPorId(pedidoId);
            if(!pedido || pedido.usuarioId !== usuarioId) {
                throw new Error('Pedido não encontrado ou não autorizado.');
            }

            if(pedido.status !== 'PAGO') {
                throw new Error('Só é possível enviar pedidos com Status "PAGO".');
            }

            pedido.status = 'ENVIADO';
            await pedido.save();
            return pedido;
        } catch (error) {
            console.error("Erro ao enviar pedido:", error);
            throw error;
        }
    }

    async cancelar(pedidoId, usuarioId){
        try {
            const pedido = await this.listarPorId(pedidoId);
            if(!pedido || pedido.usuarioId !== usuarioId) {
                throw new Error('Pedido não encontrado ou não autorizado.');
            }

            if(pedido.status === 'ENTREGUE') {
                throw new Error('Não é possível cancelar pedidos já entregues.');
            }

            if(pedido.status === 'ENVIADO') {
                throw new Error('Não é possível cancelar pedidos já enviados.');
            }

            pedido.status = 'CANCELADO';
            await pedido.save();
            return pedido;
        } catch (error) {
            console.error("Erro ao cancelar pedido:", error);
            throw error;
        }
    }

    async finalizar(pedidoId, usuarioId){
        try {
            const pedido = await this.listarPorId(pedidoId);
            if(!pedido || pedido.usuarioId !== usuarioId) {
                throw new Error('Pedido não encontrado ou não autorizado.');
            }

            if(pedido.status !== 'ENVIADO') {
                throw new Error('Só é possível finalizar pedidos com Status "ENVIADO".');
            }

            pedido.status = 'ENTREGUE';
            await pedido.save();
            return pedido;
        } catch (error) {
            console.error("Erro ao finalizar pedido:", error);
            throw error;
        }
    }

}

module.exports = SequelizePedidoRepository;
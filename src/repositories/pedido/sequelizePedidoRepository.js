const IPedidoRepository = require("./interfacePedidoRepository");
const {Pedido, Produto, ItemPedido, Usuario} = require("../../models");
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
                    include: [{
                        model: Produto,
                        as: 'produto',
                    }]
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

            if (!pedido) {
                throw new Error(`Pedido com ID ${pedidoId} não encontrado.`);
            }

            if (pedido.status !== 'CRIADO') {
                throw new Error('Só é possível aceitar pedidos com Status "CRIADO".');
            }

            const novoStatus = 'ACEITO';
            const valoresValidos = ['CRIADO', 'ACEITO', 'PAGO', 'ENVIADO', 'ENTREGUE', 'CANCELADO'];
            if (!valoresValidos.includes(novoStatus)) {
                throw new Error(`Status inválido: ${novoStatus}. Os valores válidos são: ${valoresValidos.join(', ')}`);
            }
            console.log("Novo status:", novoStatus);
            pedido.status = novoStatus;
            await pedido.save();
            return pedido;
        } catch (error) {
            console.error(`Erro ao aceitar pedido (ID: ${pedidoId}):`, error.message);
            throw error;
        }
    }

    async pagar(pedidoId, usuarioId, numeroCartao){
        try {
            const pedido = await this.listarPorId(pedidoId);
            if(!pedido || pedido.usuarioId !== usuarioId) {
                throw new Error('Pedido não encontrado ou não autorizado.');
            }

            if(pedido.status !== 'ACEITO') {
                throw new Error('Só é possível realizar o pagamento com Status "ACEITO".');
            }

            const ultimoDigito = numeroCartao.slice(-1);

            if (parseInt(ultimoDigito) % 2 === 0) {
                pedido.status = 'PAGO';
                await pedido.save();
                return pedido;
            } else {
                throw new Error('Pagamento recusado. Verifique os dados do cartão.');
            }
        } catch (error) {
            console.error("Erro ao pagar pedido:", error);
            throw error;
        }
    }

    async enviar(pedidoId, usuarioId){
        try {
            const pedido = await this.listarPorId(pedidoId);
            if(!pedido) {
                throw new Error('Pedido não encontrado.');
            }

            //CORRIGIR DEPOIS PARA O STATUS 'PAGO', E FAZER COM QUE AO CRIAR O PEDIDO O ADMIN ACEITE E DEPOIS O USUARIO PAGUE
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
            if(!pedido) {
                throw new Error('Pedido não encontrado.');
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
            if(!pedido) {
                throw new Error('Pedido não encontrado.');
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

    async listarPedidosByAdmin() {
        try {
            return await Pedido.findAll({
                include: [
                    {model: Usuario, as: 'usuario'},
                    {model: ItemPedido, as: 'itens', include: [{
                            model: Produto,
                            as: 'produto',
                        }]}
                ],
            });
        } catch (error) {
            console.error("Erro ao listar pedidos por administrador:", error);
            throw error;
        }
    }
}

module.exports = SequelizePedidoRepository;
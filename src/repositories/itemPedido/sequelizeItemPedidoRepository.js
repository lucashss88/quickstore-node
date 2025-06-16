const {ItemPedido} = require("../../models");
const {sequelize} = require("../../config/database");
const IItemPedidoRepository = require("./interfaceItemPedidoRepository");

class SequelizeItemPedidoRepository extends IItemPedidoRepository{
    async criar(pedido, itemCarrinho, options = {}){
        try{
            await ItemPedido.create({
                pedidoId: pedido.id,
                produtoId: itemCarrinho.produtoId,
                quantidade: itemCarrinho.quantidade,
                valorUnitario: itemCarrinho.preco
                },
                options
            );
            console.log("Item criado com sucesso!");
        } catch(err) {
            console.log("Erro ao criar item: ",err);
            throw new Error("Erro ao criar item no pedido");
        }
    }
}

module.exports = SequelizeItemPedidoRepository;
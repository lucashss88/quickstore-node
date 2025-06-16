const Carrinho = require('./Carrinho');
const ItemCarrinho = require('./ItemCarrinho');
const Usuario = require('./Usuario');
const Pedido = require('./Pedido');
const Produto = require('./Produto');
const ItemPedido = require('./ItemPedido');
const {sequelize} = require("../config/database");

Carrinho.hasMany(ItemCarrinho, { foreignKey: 'carrinhoId', as: 'itens', onDelete: 'CASCADE' });
ItemCarrinho.belongsTo(Carrinho, { foreignKey: 'carrinhoId' });

Produto.hasMany(ItemCarrinho, { foreignKey: 'produtoId'});
ItemCarrinho.belongsTo(Produto, { foreignKey: 'produtoId' });

Usuario.hasOne(Carrinho, { foreignKey: 'usuarioId' });
Carrinho.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

Pedido.hasMany(ItemPedido, { foreignKey: 'pedidoId', as: 'itens', onDelete: 'CASCADE' });
ItemPedido.belongsTo(Pedido, { foreignKey: 'pedidoId' });

Produto.hasMany(ItemPedido, { foreignKey: 'produtoId', as: 'itens'});
ItemPedido.belongsTo(Produto, { foreignKey: 'produtoId',});

Usuario.hasMany(Pedido, { foreignKey: 'usuarioId' });
Pedido.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

sequelize.sync({alter: true})
    .then(() => console.log('Tabelas criadas com sucesso!'))
    .catch(err => console.log(err));

module.exports = {
    Carrinho,
    ItemCarrinho,
    Usuario,
    ItemPedido,
    Produto,
    Pedido
};
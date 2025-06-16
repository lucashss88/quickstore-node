const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');

const ItemPedido = sequelize.define('ItemPedido', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    valorUnitario: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    pedidoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tb_pedido',
            key: 'id'
        },
        onDelete: 'CASCADE',
    },
    produtoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tb_produto',
            key: 'id'
        },
        onDelete: 'CASCADE',
    }
}, {
    tableName: 'tb_item_pedido',
    timestamps: false,
});

module.exports = ItemPedido;
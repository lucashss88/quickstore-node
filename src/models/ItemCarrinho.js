const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');

const ItemCarrinho = sequelize.define('ItemCarrinho', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    preco: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    tableName: 'tb_item_carrinho',
    timestamps: false,
});

module.exports = ItemCarrinho;
const { DataTypes } = require('sequelize');
const { sequelize} = require('../config/database');

const Carrinho = sequelize.define('Carrinho', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    valorTotal: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
    },
}, {
    tableName: 'tb_carrinho',
    timestamps: true,
});

module.exports = Carrinho;
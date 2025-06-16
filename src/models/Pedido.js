const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');

const Pedido = sequelize.define('Pedido', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    dataPedido: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    valorTotal: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('CRIADO' ,'ACEITO' ,'PAGO' ,'ENVIADO', 'ENTREGUE', 'CANCELADO'),
        allowNull: false,
        defaultValue: 'CRIADO', // Enum equivalente
    },
    usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'tb_pedido',
    timestamps: true,
});

module.exports = Pedido;
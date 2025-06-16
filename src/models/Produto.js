const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');

const Produto = sequelize.define('Produto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'O nome do produto é obrigatório.',
            },
        },
    },
    preco: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'O preço do produto é obrigatório.',
            },
            isPositive(value) {
                if (value <= 0) {
                    throw new Error('O preço deve ser um valor positivo.');
                }
            },
        },
    },
    estoque: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'O estoque do produto é obrigatório.',
            },
            min: {
                args: [0],
                msg: 'O estoque deve ser um valor maior ou igual a zero.',
            },
        },
    },
    descricao: {
        type: DataTypes.STRING,
    },
    imagemUrl: {
        type: DataTypes.STRING,
        field: 'imagem_url',
    },
}, {
    tableName: 'tb_produto',
    timestamps: true,
});

module.exports = Produto;
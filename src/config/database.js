const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: false
    });
} else {
    sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: true
    });
}

sequelize.authenticate()
    .then(() => console.log('Postgres connected...'))
    .catch(err => console.error('Error connecting to Postgres:', err.message));

sequelize.sync({ alter: true })
    .then(() => console.log('Sincronização completa! Tabelas criadas/alteradas'))
    .catch((err) => console.error('Erro ao sincronizar o banco:', err));

module.exports = { sequelize };
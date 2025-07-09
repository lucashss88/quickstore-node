'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const hashedPassword = await bcrypt.hash('SenhaForte123', 10);

        await queryInterface.bulkInsert('Usuarios', [{
            nome: 'Administrador',
            email: 'admin@meuecommerce.com',
            senha: hashedPassword,
            role: 'admin',
            createdAt: new Date(),
            updatedAt: new Date()
        }], {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Usuarios', { email: 'admin@meuecommerce.com' });
    }
};
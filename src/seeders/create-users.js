// seed.js

const { sequelize } = require('../config/database');
const User = require('../models/Usuario');

const seedDatabase = async () => {
    try {
        await sequelize.sync();
        console.log('Banco de dados sincronizado.');

        const usuarioComum = await User.create({
            nome: 'Usuário de Teste',
            email: 'usuario@teste.com',
            senha: 'senha123',
        });
        console.log('Usuário comum criado:', usuarioComum.toJSON());


        const admin = await User.create({
            nome: 'Administrador',
            email: 'admin@teste.com',
            senha: 'admin123',
            role: 'admin',
        });
        console.log('Administrador criado:', admin.toJSON());

        console.log('\nSeed concluído com sucesso!');

    } catch (error) {
        console.error('Erro ao executar o seed:', error);
    } finally {
        await sequelize.close();
    }
};
seedDatabase();
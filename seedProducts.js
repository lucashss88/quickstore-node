const { sequelize } = require('./src/config/database');
const Produto = require('./src/models/Produto');

const produtosParaCriar = [
    { nome: 'Smartphone Galaxy S25', preco: 4999.90, estoque: 50, descricao: 'O mais recente lançamento com câmera de 200MP e tela AMOLED 2x.', imagemUrl: 'https://picsum.photos/seed/1/400/400' },
    { nome: 'Notebook Pro X1', preco: 7899.00, estoque: 30, descricao: 'Notebook ultrafino com processador de última geração e 16GB de RAM.', imagemUrl: 'https://picsum.photos/seed/2/400/400' },
    { nome: 'Fone de Ouvido Bluetooth T5', preco: 299.99, estoque: 150, descricao: 'Fone com cancelamento de ruído ativo e 20 horas de bateria.', imagemUrl: 'https://picsum.photos/seed/3/400/400' },
    { nome: 'Smartwatch Active 3', preco: 1200.50, estoque: 80, descricao: 'Relógio inteligente com monitoramento cardíaco e GPS integrado.', imagemUrl: 'https://picsum.photos/seed/4/400/400' },
    { nome: 'Camiseta Básica de Algodão', preco: 79.90, estoque: 200, descricao: 'Camiseta confortável para o dia a dia, disponível em várias cores.', imagemUrl: 'https://picsum.photos/seed/5/400/400' },
    { nome: 'Calça Jeans Slim Fit', preco: 199.90, estoque: 120, descricao: 'Calça jeans com corte moderno e tecido com elastano.', imagemUrl: 'https://picsum.photos/seed/6/400/400' },
    { nome: 'Tênis de Corrida Runner Pro', preco: 450.00, estoque: 90, descricao: 'Tênis leve com amortecimento de alta performance para corredores.', imagemUrl: 'https://picsum.photos/seed/7/400/400' },
    { nome: 'Mochila Executiva para Notebook', preco: 250.00, estoque: 100, descricao: 'Mochila resistente à água com compartimento para notebook de até 15.6".', imagemUrl: 'https://picsum.photos/seed/8/400/400' },
    { nome: 'Cafeteira Expresso Automática', preco: 899.90, estoque: 40, descricao: 'Prepare cafés deliciosos com o toque de um botão.', imagemUrl: 'https://picsum.photos/seed/9/400/400' },
    { nome: 'Liquidificador Power Max', preco: 180.00, estoque: 110, descricao: 'Motor potente de 1000W e copo de vidro resistente.', imagemUrl: 'https://picsum.photos/seed/10/400/400' },
    { nome: 'Cadeira Gamer Ergonômica', preco: 1500.00, estoque: 25, descricao: 'Cadeira com suporte lombar e ajustes de altura e inclinação.', imagemUrl: 'https://picsum.photos/seed/11/400/400' },
    { nome: 'Teclado Mecânico RGB', preco: 499.90, estoque: 70, descricao: 'Teclado com switches de alta precisão e iluminação RGB customizável.', imagemUrl: 'https://picsum.photos/seed/12/400/400' },
    { nome: 'Mouse Gamer Hero 16K', preco: 350.00, estoque: 130, descricao: 'Mouse com sensor de alta precisão e design ambidestro.', imagemUrl: 'https://picsum.photos/seed/13/400/400' },
    { nome: 'Monitor Gamer Curvo 27"', preco: 2200.00, estoque: 35, descricao: 'Monitor com 144Hz de taxa de atualização e 1ms de tempo de resposta.', imagemUrl: 'https://picsum.photos/seed/14/400/400' },
    { nome: 'Livro: A Psicologia Financeira', preco: 49.90, estoque: 300, descricao: 'Lições atemporais sobre fortuna, ganância e felicidade.', imagemUrl: 'https://picsum.photos/seed/15/400/400' },
    { nome: 'Kit de Ferramentas 129 Peças', preco: 320.00, estoque: 60, descricao: 'Maleta completa com uma vasta gama de ferramentas para casa.', imagemUrl: 'https://picsum.photos/seed/16/400/400' },
    { nome: 'Luminária de Mesa LED', preco: 120.00, estoque: 180, descricao: 'Luminária com braço flexível e controle de intensidade de luz.', imagemUrl: 'https://picsum.photos/seed/17/400/400' },
    { nome: 'Garrafa Térmica Inox 1L', preco: 95.00, estoque: 250, descricao: 'Mantém sua bebida quente ou fria por até 12 horas.', imagemUrl: 'https://picsum.photos/seed/18/400/400' },
    { nome: 'Câmera de Segurança Wi-Fi', preco: 280.00, estoque: 95, descricao: 'Câmera com visão noturna, áudio bidirecional e acesso via app.', imagemUrl: 'https://picsum.photos/seed/19/400/400' },
    { nome: 'Óculos de Sol Aviador Clássico', preco: 399.00, estoque: 85, descricao: 'Design icônico com proteção UV400 e armação de metal.', imagemUrl: 'https://picsum.photos/seed/20/400/400' },
];

const seedDatabase = async () => {
    try {
        console.log('Conectando ao banco de dados...');
        await sequelize.sync({ alter: true });

        console.log('Limpando a tabela de produtos...');
        await Produto.destroy({ where: {}, cascade: true, restartIdentity: true });

        console.log('Criando 20 novos produtos...');
        await Produto.bulkCreate(produtosParaCriar);

        console.log('✅ Produtos criados com sucesso!');

    } catch (error) {
        console.error('❌ Erro ao popular o banco de dados:', error);
    } finally {
        console.log('Fechando conexão com o banco...');
        await sequelize.close();
    }
};

seedDatabase();
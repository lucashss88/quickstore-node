const {Carrinho, ItemCarrinho, Produto} = require("../../models");
const ICarrinhoRepository = require("./interfaceCarrinhoRepository");

class SequelizeCarrinhoRepository extends ICarrinhoRepository {
    constructor(itemCarrinhoRepository, produtoRepository) {
        super();
        this.itemCarrinhoRepository = itemCarrinhoRepository;
        this.produtoRepository = produtoRepository;
    }

    async buscarCarrinhoPorId(usuarioId) {
        try {
            console.log("usuarioId recebido em buscarCarrinhoPorId:", usuarioId);
            const [carrinho] = await Carrinho.findOrCreate({
                where: {usuarioId},
                defaults: {usuarioId},
                include: [{
                    model: ItemCarrinho,
                    as: 'itens',
                    include: [Produto]
                }]
            });
            console.log("Carrinho retornado: ", carrinho);
            return carrinho;
        } catch (error) {
            console.error("Erro ao buscar carrinho por ID:", error);
            throw error;       
        }
    }

    async adicionarProdutoAoCarrinho(usuarioId, produtoId, quantidade) {
        try {
            const quantidadeValida = parseInt(quantidade, 10);
            console.log("Quantidade: ", quantidadeValida);
            if (isNaN(quantidadeValida) || quantidadeValida <= 0) {
                throw new Error('Quantidade inválida. Deve ser um número inteiro positivo.');
            }

            const carrinho = await this.buscarCarrinhoPorId(usuarioId);
            if (!carrinho) {
                throw new Error('Carrinho inexistente. Tente criar um novo carrinho ou entrar em um carrinho existente.');
            }

            const produto = await this.produtoRepository.buscarProdutoPorId(produtoId);
            console.log("Produto: ", produto);

            if (!produto) {
                throw new Error('Produto não encontrado');
            }

            let item = await this.itemCarrinhoRepository.buscarItemCarrinhoPorId(produtoId, carrinho);
            console.log("Item: ", item);

            if (item) {
               await this.itemCarrinhoRepository.atualizarQuantidadeEPreco(item, quantidadeValida, produto);
            } else {
                item = await this.itemCarrinhoRepository.criar(carrinho, produtoId, quantidadeValida);
            }

            const itens = await this.itemCarrinhoRepository.listarTodos(carrinho.id);
            carrinho.valorTotal = itens.reduce((sum, i) => sum + i.preco, 0);
            await carrinho.save();

            return carrinho;
        } catch (error) {
            console.error("Erro ao adicionar produto ao carrinho:", error);
            throw error;
        }       
    }

    async removerProdutoDoCarrinho(usuarioId, produtoId) {
        const carrinho = await this.buscarCarrinhoPorId(usuarioId);
        console.log("Carrinho encontrado: ", carrinho);
        return this.itemCarrinhoRepository.deletar(carrinho.id, produtoId);
    }

    async atualizarQuantidadeDoItem(item, quantidade){
        try {
            item.quantidade = quantidade;
            return await item.save();
        } catch (error) {
            console.error("Erro ao atualizar quantidade do item:", error);
            throw error;
        }
    }

    async calcularValorTotal(carrinhoId) {
        try {
            const itens = await this.itemCarrinhoRepository.listarTodos(carrinhoId);
            const total = itens.reduce((total, item) => total + item.preco * item.quantidade, 0);
            await Carrinho.update({valorTotal: total}, {where: {id: carrinhoId}});
            return total;
        } catch (error) {
            console.error("Erro ao calcular valor total:", error);
            throw error;
        }
    }
}

module.exports = SequelizeCarrinhoRepository;
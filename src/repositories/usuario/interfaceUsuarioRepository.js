class IUsuarioRepository {
    async buscarUsuarioPorEmail(email){ throw new Error('Método não implementado'); }
    async buscarUsuarioPorId(id){ throw new Error('Método não implementado'); }
    async criar(email, senha, nome){ throw new Error('Método não implementado'); }
    async atualizar(id, nome, email){ throw new Error('Método não implementado'); }
    async deletar(id){ throw new Error('Método não implementado'); }
    async buscarUsuarios(){ throw new Error('Método não implementado'); }
}

module.exports = IUsuarioRepository;
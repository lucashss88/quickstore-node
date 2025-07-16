const SequelizeUsuarioRepository = require("../repositories/usuario/sequelizeUsuarioRepository");

class UsuarioService {
    static usuarioRepository = new SequelizeUsuarioRepository();

    static async atualizar(id, nome, email){
        return await this.usuarioRepository.atualizar(id, nome, email);
    }

    static async buscarPorEmail(email){
        return await this.usuarioRepository.buscarUsuarioPorEmail(email);
    }

    static async buscarPorId(id){
        return await this.usuarioRepository.buscarUsuarioPorId(id);
    }
}

module.exports = UsuarioService;
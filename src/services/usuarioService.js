const SequelizeUsuarioRepository = require("../repositories/usuario/sequelizeUsuarioRepository");

class UsuarioService {
    static usuarioRepository = new SequelizeUsuarioRepository();

    static async atualizar(email, usuario){
        return await this.usuarioRepository.atualizar(email, usuario);
    }

    static async buscarPorEmail(email){
        return await this.usuarioRepository.buscarUsuarioPorEmail(email);
    }

    static async buscarPorId(id){
        return await this.usuarioRepository.buscarUsuarioPorId(id);
    }
}

module.exports = UsuarioService;
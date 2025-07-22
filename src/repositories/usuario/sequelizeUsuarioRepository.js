const {Usuario} = require("../../models");
const IUsuarioRepository = require("./interfaceUsuarioRepository");

class SequelizeUsuarioRepository extends IUsuarioRepository{
    async buscarUsuarioPorEmail(email){
        return await Usuario.findOne({where: {email}});
     }
     async buscarUsuarioPorId(id){
        return await Usuario.findByPk(id);
     }
     async criar(email, senha, nome, role){
         const novoUsuario = new Usuario({
             email,
             senha,
             nome,
             role
         })
         return await novoUsuario.save();
     }
     async atualizar(id, nome, email){
        const usuarioAtualizado = await this.buscarUsuarioPorId(id);
         if (!usuarioAtualizado) {
             throw new Error("Usuario não encontrado");
         }
         usuarioAtualizado.nome = nome || usuarioAtualizado.nome;
         usuarioAtualizado.email = email || usuarioAtualizado.email;

         return await usuarioAtualizado.save();
     }

     async deletar(id){
        const usuarioEncontrado = await Usuario.findByPk(id);
        if (!usuarioEncontrado) {
            throw new Error("Usuario não encontrado");
        }
        return await usuarioEncontrado.destroy();
     }

     async buscarUsuarios(){
        return await Usuario.findAll({
            where: {role: 'usuario'}
        });
     }
}

module.exports = SequelizeUsuarioRepository;
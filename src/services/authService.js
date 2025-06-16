const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SequelizeUserRepository = require("../repositories/usuario/sequelizeUsuarioRepository");

class AuthService {
    static usuarioRepository = new SequelizeUserRepository();

    static async login(email, password) {
        let user = await this.usuarioRepository.buscarUsuarioPorEmail(email);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 400;
            throw error;
        }

        const isMatch = await bcrypt.compare(password, user.senha);
        if (!isMatch) {
            const error = new Error('Invalid credentials. Please try again.');
            error.statusCode = 400;
            throw error;
        }

        const payload = {
            id: user.id,
            // role: user.role
        };
        return new Promise((resolve, reject) => {
            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                {expiresIn: 3600},
                (err, token) => {
                    if (!err) {
                        console.log('User logged in successfully');
                        resolve({
                            token,
                            user: {
                                id: user.id,
                                email: user.email,
                                // role: user.role
                            },
                            message: 'User logged in successfully'
                        });
                    } else {
                        console.log('Error ao gerar token:', err);
                        reject(err);
                    }
                }
            );
        });
    }

    static async registrar(email, senha, nome) {
        let user = await this.usuarioRepository.buscarUsuarioPorEmail(email);
        if (user) {
            const error = new Error('User already exists');
            error.statusCode = 400;
            throw error;
        }

        if (!nome || !email || !senha) {
            const error = new Error('Please provide all the required fields');
            error.statusCode = 400;
            throw error;
        }

        if (senha.length < 6) {
            const error = new Error('Password must be at least 6 characters long');
            error.statusCode = 400;
            throw error;
        }

        user = await this.usuarioRepository.criar(email, senha, nome);

        const payload = {
            id: user.id,
            //role: user.role,
        };

        return new Promise((resolve, reject) => {
            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                {expiresIn: 3600},
                (err, token) => {
                    if (!err) {
                        console.log('User registered successfully');
                        resolve({
                            token,
                            user: {
                                id: user.id,
                                email: user.email,
                                //role: user.role
                            },
                            message: 'User registered successfully'
                        });
                    } else {
                        console.log('Error ao gerar token:', err);
                        reject(err);
                    }
                }
            )
        })
    }
}

module.exports = AuthService;
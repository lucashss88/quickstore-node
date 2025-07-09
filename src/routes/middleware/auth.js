const jwt = require('jsonwebtoken');
require('dotenv').config();

function auth(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        console.error("Erro ao autenticar usuário:", err.message);
        res.status(401).json({ error: 'Token inválido ou expirado.' });

    }
}

function authorize(roles = []) {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ msg: 'Autenticação necessária.' });
        }

        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(403).json({ msg: 'Acesso negado. Permissões insuficientes.' });
        }

        next();
    };
}

module.exports = { auth, authorize };
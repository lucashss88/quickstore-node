const jwt = require('jsonwebtoken');
require('dotenv').config();

function auth(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}

function authorize(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ msg: 'Permission denied' });
        }
        next();
    };
}

module.exports = { auth, authorize };
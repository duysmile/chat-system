const jwt = require('jsonwebtoken');
const privateKey = 'secretkey';

exports.verifyToken = (req, res, next) => {
    const { token } = req.query;
    if (!token) {
        return next(new Error('TOKEN_NOT_FOUND'));
    }
    jwt.verify(token, privateKey);
    return next();
}

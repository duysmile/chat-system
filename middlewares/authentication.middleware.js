const jwtHelper = require('../helpers/jwt.helper');

exports.verifyToken = (req, res, next) => {
    const { token } = req.query;
    if (!token) {
        return next(new Error('TOKEN_NOT_FOUND'));
    }
    jwtHelper.verifyToken(token);
    return next();
}

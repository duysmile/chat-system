const jwtHelper = require('../helpers/jwt.helper');

exports.verifyToken = (req, res, next) => {
    const token = req.body.token || req.params.token || req.headers.token;
    if (!token) {
        return next(new Error('AUTHENTICATION_FAILED'));
    }
    const [ prefixToken, accessToken ] = token.split(' ');
    if (prefixToken !== 'Bearer') {
        return next(new Error('JWT_INVALID_FORMAT'));
    }
    jwtHelper.verifyToken(accessToken);
    return next();
}

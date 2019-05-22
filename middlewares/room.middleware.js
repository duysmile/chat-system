const jwtHelper = require('../helpers/jwt.helper');

exports.getUserData = (req, res, next) => {
    const token = req.body.token || req.params.token || req.headers.token;
    if (!token) {
        return next(new Error('AUTHENTICATION_FAILED'));
    }
    const [ prefixToken, accessToken ] = token.split(' ');
    if (prefixToken !== 'Bearer') {
        return next(new Error('JWT_INVALID_FORMAT'));
    }
    const dataVerified = jwtHelper.verifyToken(accessToken);
    if (dataVerified.resetPassword) {
        return next(new Error('INVALID_TOKEN'));
    }
    req.body.author = dataVerified._id;
    console.log(req.body.author);
    return next();
}

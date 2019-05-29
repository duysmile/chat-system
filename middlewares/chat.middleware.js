const jwtHelper = require('../helpers/jwt.helper');
const User = require('../models/user');

exports.getUserData = async (req, res, next) => {
    try {
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
        const user = await User.findById(dataVerified._id).select('deletedAt').lean();
        if (!!user.deletedAt) {
            return next(new Error('USER_IS_IN_ACTIVE'));
        }
        req.user = {
            id: dataVerified._id
        };
        return next();
    } catch (error) {
        return next(error);
    }
}

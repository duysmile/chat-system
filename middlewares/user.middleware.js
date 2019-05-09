const Constants = require('../common/constants'); 

// Middleware ----------------------------------------

const validateCreateUser = function(req, res, next) {
    const { username, password } = req.body;
    if (!username) {
        return next(new Error(Constants.ERROR.REQUIRED_USERNAME));
    }

    if (!password) {
        return next(new Error(Constants.ERROR.REQUIRED_PASSWORD));
    }

    return next();
};

const validateUpdateUser = function(req, res, next) {
    const { username, password } = req.body;
    if (!username && !password) {
        return next(new Error(Constants.ERROR.REQUIRED_FIELD));
    }
    return next();
};

module.exports = {
    validateCreateUser,
    validateUpdateUser
};

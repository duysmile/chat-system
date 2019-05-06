const Constants = require('../common/constants'); 

// Method --------------------------------------------
function CustomError(message = Constants.ERROR.COMMON) {
    return new Error(message);
}

// Middleware ----------------------------------------

const validateCreateUser = function(req, res, next) {
    const { username, password } = req.body;
    if (!username) {
        return next(new Error('Username is a required field.'));
    }

    if (!password) {
        return next(new Error('Password is a required field.'));
    }

    return next();
};

const validateUpdateUser = function(req, res, next) {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
        return next(CustomError(Constants.ERROR.INVALID_INTEGER));
    }
    const { username, password } = req.body;
    if (!username) {
        return next(CustomError(Constants.ERROR.REQUIRED_USERNAME));
    }

    if (!password) {
        return next(CustomError(Constants.ERROR.REQUIRED_PASSWORD));
    }
    return next();
};

module.exports = {
    validateCreateUser,
    validateUpdateUser
};

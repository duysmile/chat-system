const Constants = require('../common/constants'); 

// Middleware ----------------------------------------

const validateInputForUser = function(req, res, next) {
    const { username, password } = req.body;
    if (!username) {
        return next(new Error(Constants.ERROR.REQUIRED_USERNAME));
    }

    if (!password) {
        return next(new Error(Constants.ERROR.REQUIRED_PASSWORD));
    }

    return next();
};

module.exports = {
    validateInputForUser,
};

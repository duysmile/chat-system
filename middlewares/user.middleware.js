const Constants = require('../common/constants'); 

// Method --------------------------------------------
function CustomError(message) {
    return new Error(message);
}

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

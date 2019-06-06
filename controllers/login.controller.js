const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwtHelper = require('../helpers/jwt.helper');
const { ResponseSuccess, ResponseError } = require('../helpers/response.helper');

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username }).lean();
        if (!user) {
            return ResponseError('USERNAME_NOT_EXISTED', res);
        }

        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (!isValidPassword) {
            return ResponseError('INCORRECT_PASSWORD', res);
        }
        
        delete user.password;

        const token = jwtHelper.generateToken({ username, _id: user._id });
        return ResponseSuccess('LOGIN_SUCCESS', {
            data: user,
            access_token: token
        }, res);
    } catch (error) {
        return next(error);
    }
};
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const privateKey = 'secretkey';

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username }).lean();
        if (!user) {
            return next(new Error('Username is not existed!'));
        }

        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (!isValidPassword) {
            return next(new Error('Password is incorrect!'));
        }
        
        delete user.password;
        const token = jwt.sign({ username }, privateKey, { expiresIn: 60 * 60 });
        return res.status(200).json({
            message: 'Login successfully',
            data: user,
            access_token: token
        });
    } catch (error) {
        return next(error);
    }
};
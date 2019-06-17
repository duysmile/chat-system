const bcrypt = require('bcrypt');
const jwtHelper = require('../helpers/jwt.helper');
const { ResponseSuccess, ResponseError } = require('../helpers/response.helper');
const { userRepository } = require('../repositories');
const axios = require('axios');

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const user = await userRepository.getOne({
            where: { username }
        });
        if (!user) {
            return next(new Error('USERNAME_NOT_EXISTED'));
        }

        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (!isValidPassword) {
            return next(new Error('INCORRECT_PASSWORD'));
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

exports.loginByFB = async (req, res, next) => {
    try {
        const { accessToken } = req.body;
        const responseFB = await axios.get(`https://graph.facebook.com/me?access_token=${accessToken}&fields=email,name`);
        console.log(responseFB.data);

        const { id, email, name } = responseFB.data;
        
        const existedUser = await userRepository.getOneAndUpdate({
            where: {
                'facebook.userId': id
            },
            data: {
                email,
                facebook: {
                    userId: id
                }
            },
            options: {
                upsert: true,
                setDefaultsOnInsert: true,
                new: true
            }
        });
        
        const token = jwtHelper.generateToken({ 
            username: name, 
            _id: existedUser._id 
        });

        return ResponseSuccess('LOGIN_SUCCESS', {
            data: existedUser,
            access_token: token
        }, res);  
    } catch (error) {
        return next(error);            
    }
};

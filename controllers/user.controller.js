const Constants = require('../common/constants'); 
const { ObjectId } = require('mongodb');
const { ResponseSuccess } = require('../helpers/response.helper');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const jwtHelper = require('../helpers/jwt.helper');
const mailHelper = require('../helpers/mail.helper');
const { userRepository } = require('../repositories/index');

// Controller -----------------------------------

const getListUsers = async function(req, res, next) {
    try {
        const {page, limit, ...query} = _.omitBy(req.query, _.isNil);
        if (!!query.username) {
            query.username = {
                $regex: new RegExp(query.username, 'ig')
            };
        }

        const listUsers = await userRepository.getAll({
            page,
            limit,
            where: query,
            fields: '-password -token'
        });

        return ResponseSuccess(Constants.SUCCESS.GET_LIST_USERS, listUsers, res);
    } catch (error) {
        return next(error);
    }
};

const getUserById = async function(req, res, next) {
    try {
        const userId = req.params.id;

        const user = await userRepository.getOne({ 
            where: {
                _id: ObjectId(userId)
            },
            fields: '-password -token' 
        });

        if (!user) {
            return next(new Error(Constants.ERROR.NOT_EXISTED_USER));
        }

        return ResponseSuccess(Constants.SUCCESS.GET_USER_BY_ID, user, res);
    } catch (error) {
        return next(error);
    }
};

const createUser = async function(req, res, next) {
    try {
        const { 
            username, 
            password, 
            email, 
            gender,
            geoPosition
        } = req.body;
        
        const salt = bcrypt.genSaltSync(2);
        const hashPassword = bcrypt.hashSync(password, salt);
        const newUser = await userRepository.create({ 
            username, 
            email,
            gender,
            geoPosition, 
            password: hashPassword 
        });
        let dataUser = newUser.toObject();
        delete dataUser.password;

        return ResponseSuccess(Constants.SUCCESS.CREATE_USER, dataUser, res);
    } catch (error) {
        return next(error);
    }
};

const deleteUser = async function(req, res, next) {
    try {
        const userId = req.params.id;

        const dataDelete = await userRepository.deleteOne({
            where: {
                _id: ObjectId(userId) 
            },
            fields: '-password -token'
        });
        if (!dataDelete) {
            return next(new Error(Constants.ERROR.NOT_EXISTED_USER));
        }
        
        return ResponseSuccess(Constants.SUCCESS.DELETE_USER, dataDelete, res);
    } catch (error) {
        return next(error);
    }
};

const updateUser = async function(req, res, next) {
    try {
        const userId = req.params.id;
        const { username, password } = req.body;
    
        const salt = bcrypt.genSaltSync(2);
        const hashPassword = password && bcrypt.hashSync(password, salt);

        let newUser = {
            username, 
            email,
            gender,
            geoPosition,
            password: hashPassword
        };
        
        newUser = _.omitBy(newUser, _.isNil);
        
        const updateInfo = { $set: newUser };
        const dataUpdate = await userRepository.getOneAndUpdate({
            where: {
                _id: userId
            },
            data: updateInfo,
            fields: '-password -token'
        });
        if (!dataUpdate) {
            return next(new Error(Constants.ERROR.NOT_EXISTED_USER));
        }
        
        return ResponseSuccess(Constants.SUCCESS.UPDATE_USER, dataUpdate, res);
    } catch (error) {
        return next(error);
    }
};

const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const token = jwtHelper.generateToken({ email, resetPassword: true }, { expiresIn: 10 * 60 });

        const isExistedEmail = await userRepository.getOneAndUpdate({ 
            where: {
                email 
            }, 
            data: {
                $set: { token }
            }
        });
        if (!isExistedEmail) {
            return next(new Error('EMAIL_NOT_EXISTED'));
        }
        await mailHelper.sendMail(email, 'FORGOT_PASSWORD', { token });
        return ResponseSuccess('Please check email to change password!', true, res);
    } catch (error) {
        return next(error);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const { code, password } = req.body;
        const { email } = jwtHelper.verifyToken(code);
        const salt = bcrypt.genSaltSync(2);
        const hashPassword = bcrypt.hashSync(password, salt);
        
        const requestingChangePassword = await userRepository.getOneAndUpdate({ 
            where: {
                email, 
                token: code 
            }, 
            data: {
                $set: { password: hashPassword }
            }
        });
        if (!requestingChangePassword) {
            return next(new Error('ERROR_RESET_PASSWORD'));
        }

        await User.updateOne({ email }, {
            $set: {
                token: null
            }
        });
        return ResponseSuccess('Change password successfully', true, res);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListUsers,
    getUserById,
    createUser,
    deleteUser,
    updateUser,
    forgotPassword,
    resetPassword
};
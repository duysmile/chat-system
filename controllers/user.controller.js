const Constants = require('../common/constants'); 
const { ObjectId } = require('mongodb');
const { ResponseSuccess } = require('../helpers/response.helper');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const jwtHelper = require('../helpers/jwt.helper');
const mailHelper = require('../helpers/mail.helper');

const conditionNotDeleted = { 
    deletedAt: { $exists: false },
};

// Controller -----------------------------------

const getListUsers = async function(req, res, next) {
    try {
        const listUsers = await User.find(conditionNotDeleted).select('-password -token').lean();

        return ResponseSuccess(Constants.SUCCESS.GET_LIST_USERS, listUsers, res);
    } catch (error) {
        return next(error);
    }
};

const getUserById = async function(req, res, next) {
    try {
        const userId = req.params.id;

        const user = await User.findOne({ ...conditionNotDeleted, _id: ObjectId(userId) }).select('-password -token').lean();

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
        const newUser = await User.create({ 
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

        const dataDelete = await User.findOneAndDelete({ ...conditionNotDeleted, _id: ObjectId(userId) })
            .select('-password -token')
            .lean();
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
        const dataUpdate = await User.findOneAndUpdate({ ...conditionNotDeleted, _id: ObjectId(userId) }, updateInfo, { new: true })
            .select('-password -token')
            .lean();
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

        const isExistedEmail = await User.findOneAndUpdate({ ...conditionNotDeleted, email }, {
            $set: { token }
        }, { new: true }).lean();
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
        
        const requestingChangePassword = await User.findOneAndUpdate({ ...conditionNotDeleted, email, token: code }, {
            $set: { password: hashPassword }
        }).lean();
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
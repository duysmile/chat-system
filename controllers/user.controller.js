const Constants = require('../common/constants'); 
const { ObjectId } = require('mongodb');
const ResponseSuccess = require('../helpers/resonse.helper');
const User = require('../models/user');
const bcrypt = require('bcrypt');

// Controller -----------------------------------

const getListUsers = async function(req, res, next) {
    try {
        const listUsers = await User.find().select('-password').lean();

        return ResponseSuccess(Constants.SUCCESS.GET_LIST_USERS, listUsers, res);
    } catch (error) {
        return next(error);
    }
};

const getUserById = async function(req, res, next) {
    try {
        const userId = req.params.id;

        const user = await User.findOne({ _id: ObjectId(userId) }).select('-password').lean();

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
        const { username, password } = req.body;
        
        const salt = bcrypt.genSaltSync(2);
        const hashPassword = bcrypt.hashSync(password, salt);
        const newUser = await User.create({ username, password: hashPassword });
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

        const dataDelete = await User.findOneAndDelete({ _id: ObjectId(userId) })
            .select('-password')
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
            password: hashPassword
        };
        Object.keys(newUser).forEach(function(key) {
            if (newUser[key] === undefined) {
                delete newUser[key];
            }
        });
        const updateInfo = { $set: newUser };
        const dataUpdate = await User.findOneAndUpdate({ _id: ObjectId(userId) }, updateInfo, { new: true })
            .select('-password')
            .lean();
        if (!dataUpdate) {
            return next(new Error(Constants.ERROR.NOT_EXISTED_USER));
        }
        
        return ResponseSuccess(Constants.SUCCESS.UPDATE_USER, dataUpdate, res);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListUsers,
    getUserById,
    createUser,
    deleteUser,
    updateUser
};
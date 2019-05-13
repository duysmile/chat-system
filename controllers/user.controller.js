const Constants = require('../common/constants'); 
const { ObjectId } = require('mongodb');
const ResponseSuccess = require('../helpers/resonse.helper');
const User = require('../models/user');

// Controller -----------------------------------

const getListUsers = async function(req, res, next) {
    try {
        const listUsers = await User.find();

        return ResponseSuccess(Constants.SUCCESS.GET_LIST_USERS, listUsers, res);
    } catch (error) {
        return next(error);
    }
};

const getUserById = async function(req, res, next) {
    try {
        const userId = req.params.id;

        const user = await User.findOne({ _id: ObjectId(userId) });

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
    
        const isExistedUsername = await User.findOne({ username });
        if (!isExistedUsername) {
            const newUser = new User({ username, password });
            const dataInsert = await newUser.save();
            return ResponseSuccess(Constants.SUCCESS.CREATE_USER, dataInsert, res);
        }

        return next(new Error(Constants.ERROR.EXISTED_USERNAME));
    } catch (error) {
        return next(error);
    }
};

const deleteUser = async function(req, res, next) {
    try {
        const userId = req.params.id;

        const dataDelete = await User.findOneAndDelete({ _id: ObjectId(userId) });
        if (!dataDelete.value) {
            return next(new Error(Constants.ERROR.NOT_EXISTED_USER));
        }
        
        return ResponseSuccess(Constants.SUCCESS.DELETE_USER, dataDelete.value, res);
    } catch (error) {
        return next(error);
    }
};

const updateUser = async function(req, res, next) {
    try {
        const userId = req.params.id;
        const { username, password } = req.body;

        const isExistedUsername = await User.findOne({ 
            username, 
            _id: {
                $ne: ObjectId(userId)
            } 
        });
        if (isExistedUsername) {
            return next(new Error(Constants.ERROR.EXISTED_USERNAME));
        }
        
        // TODO: if only update username or password -> check undefined and update
        // let userInfo = {};

        let newUser = {
            username,
            password
        };
        Object.keys(newUser).forEach(function(key) {
            if (newUser[key] === undefined) {
                delete newUser[key];
            }
        });
        const updateInfo = { $set: newUser };
        const dataUpdate = await User.findOneAndUpdate({ _id: ObjectId(userId) }, updateInfo);
        if (!dataUpdate.value) {
            return next(new Error(Constants.ERROR.NOT_EXISTED_USER));
        }
        
        return ResponseSuccess(Constants.SUCCESS.UPDATE_USER, dataUpdate.value, res);
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
const Constants = require('../common/constants'); 
const { ObjectId } = require('mongodb');

// Method ---------------------------------------

function ResponseSuccess(message, data, res) {
    return res.status(200).json({
        message,
        data
    });
}

// Controller -----------------------------------

const getListUsers = async function(req, res, next) {
    try {
        const userCollection = req.db.collection('users');
        const listUsers = await userCollection.find({}).toArray();

        return ResponseSuccess(Constants.SUCCESS.GET_LIST_USERS, listUsers, res);
    } catch (error) {
        return next(error);
    }
};

const getUserById = async function(req, res, next) {
    try {
        const userCollection = req.db.collection('users');
        const userId = req.params.id;

        const user = await userCollection.findOne({ _id: ObjectId(userId) });

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

        const userCollection = req.db.collection('users');
    
        const isExistedUsername = await userCollection.findOne({ username });
        if (!isExistedUsername) {
            const dataInsert = await userCollection.insertOne({ username, password });
            return ResponseSuccess(Constants.SUCCESS.CREATE_USER, dataInsert.ops[0], res);
        }

        return next(new Error(Constants.ERROR.EXISTED_USERNAME));
    } catch (error) {
        return next(error);
    }
};

const deleteUser = async function(req, res, next) {
    try {
        const userId = req.params.id;

        const userCollection = req.db.collection('users');

        const dataDelete = await userCollection.findOneAndDelete({ _id: ObjectId(userId) });
        if (!dataDelete.value) {
            return next(new Error(Constants.ERROR.NOT_EXISTED_USER));
        }
        
        return ResponseSuccess(Constants.SUCCESS.DELETE_USER, dataDelete.value, res);
    } catch (error) {
        return next(CustomError());
    }
};

const updateUser = async function(req, res, next) {
    try {
        const userId = req.params.id;
        const { username, password } = req.body;

        const userCollection = req.db.collection('users');

        const isExistedUsername = await userCollection.findOne({ 
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

        const updateInfo = { $set: { username, password } };
        const dataUpdate = await userCollection.findOneAndUpdate({ _id: ObjectId(userId) }, updateInfo);
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
const path = require('path');
const fs = require('fs');
const userDataPath = path.resolve('./database');
const Constants = require('../common/constants'); 

// Method ---------------------------------------
function CustomError(message = Constants.ERROR.COMMON) {
    return new Error(message);
}

function ResponseSuccess(message, data, res) {
    return res.status(200).json({
        message,
        data
    });
}

function getFileData(next) {
    const listUsers = fs.readFileSync(userDataPath + '/users.json', 'utf8');
    if (!listUsers) {
        next(CustomError(Constants.ERROR.DATABASE));
        return [];
    }
    return listUsers;
}

function checkExistedUser(userId, listUsers) {
    const user = listUsers.find(function(tempUser) {
        return tempUser.id === userId;
    });
    if (!user) {
        return null;
    }
    return user;
}

function findIndexUser(userId, listUsers) {
    const indexUser = listUsers.findIndex(function(tempUser) {
        return tempUser.id === userId;
    });
    return indexUser;
}

function checkExistedUsername(username, listUsers) {
    const isExistedUser = listUsers.findIndex(function(user) {
        return user.username === username;
    });

    if (isExistedUser != -1) {
        return true;
    }
    return false;
}

// Controller -----------------------------------

const getListUsers = function(req, res, next) {
    try {
        const listUsers = getFileData(next);
        return ResponseSuccess(Constants.SUCCESS.GET_LIST_USERS, JSON.parse(listUsers), res);
    } catch (error) {
        console.error(error);
        return next(CustomError());
    }
};

const getUserById = function(req, res, next) {
    try {
        const userId = parseInt(req.params.id);

        let listUsers = getFileData(next);

        listUsers = JSON.parse(listUsers);
        if (!Array.isArray(listUsers)) {
            return next(CustomError(Constants.ERROR.DATABASE));
        }

        const existedUser = checkExistedUser(userId, listUsers);
        if (!existedUser) {
            return next(CustomError(Constants.ERROR.NOT_EXISTED_USER));
        }

        return ResponseSuccess(Constants.SUCCESS.GET_USER_BY_ID, existedUser, res);
    } catch (error) {
        console.error(error);
        return next(CustomError());
    }
};

const createUser = function(req, res, next) {
    try {
        const { username, password } = req.body;

        let existingUsers = fs.readFileSync(userDataPath + '/users.json', 'utf8');

        if (!existingUsers) {
            existingUsers = [];
        } else {
            existingUsers = JSON.parse(existingUsers);
            if (!Array.isArray(existingUsers)) {
                return next(CustomError(Constants.ERROR.DATABASE));
            }
            
            const isExistedUsername = checkExistedUsername(username, existingUsers);

            if (isExistedUsername) {
                return next(CustomError(Constants.ERROR.EXISTED_USERNAME));
            }
        }
        
        const newUser = {
            username,
            password
        };

        // create id for user
        const lengthOfListUsers = existingUsers.length;
        if (lengthOfListUsers === 0) {
            newUser.id = 1;
        } else {
            newUser.id = existingUsers[lengthOfListUsers - 1].id + 1;
        }

        existingUsers.push(newUser);

        fs.writeFileSync(userDataPath + '/users.json', JSON.stringify(existingUsers, null, 2));
        
        return ResponseSuccess(Constants.SUCCESS.CREATE_USER, newUser, res);
    } catch (error) {
        console.error(error);
        return next(CustomError());
    }
};

const deleteUser = function(req, res, next) {
    try {
        const userId = parseInt(req.params.id);

        let listUsers = getFileData(next);

        listUsers = JSON.parse(listUsers);
        if (!Array.isArray(listUsers)) {
            return next(CustomError(Constants.ERROR.DATABASE)); 
        }
        const indexUser = findIndexUser(userId, listUsers);
        if (indexUser === -1) {
            return next(CustomError(Constants.ERROR.NOT_EXISTED_USER)); 
        }

        listUsers.splice(indexUser, 1);

        fs.writeFileSync(userDataPath + '/users.json', JSON.stringify(listUsers, null, 2), 'utf8');

        return ResponseSuccess(Constants.SUCCESS.DELETE_USER, listUsers, res);
    } catch (error) {
        return next(CustomError());
    }
};

const updateUser = function(req, res, next) {
    try {
        const userId = parseInt(req.params.id);

        const { username, password } = req.body;

        let existingUsers = getFileData(next);

        existingUsers = JSON.parse(existingUsers);
        if (!Array.isArray(existingUsers)) {
            return next(CustomError(Constants.ERROR.DATABASE)); 
        }

        for (let user of existingUsers) {
            if (user.id === userId) {
                const isExistedUser = existingUsers.findIndex(function(user) {
                    return user.username === username && user.id !== userId;
                });
    
                if (isExistedUser !== -1) {
                    return next(CustomError(Constants.ERROR.EXISTED_USERNAME)); 
                }

                user.username = username;
                user.password = password;
                fs.writeFileSync(userDataPath + '/users.json', JSON.stringify(existingUsers, null, 2), 'utf8');
                
                return ResponseSuccess(Constants.SUCCESS.UPDATE_USER, {
                    username, 
                    password,
                    id: userId
                }, res);
            }
        }
        return next(CustomError(Constants.ERROR.NOT_EXISTED_USER)); 
    } catch (error) {
        return next(CustomError());
    }
};

module.exports = {
    getListUsers,
    getUserById,
    createUser,
    deleteUser,
    updateUser
};
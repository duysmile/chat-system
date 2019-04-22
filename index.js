const express = require('express');
const app = express();
const port = 3000;

const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

app.use(bodyParser.urlencoded({ extended: false }));

const userDataPath = path.resolve('./database');

// API create new user
app.post('/api/v1/users', (req, res) => {
    try {
        const { username, password } = req.body; 
        if (!username) {
            return res.status(500).json({
                message: 'Username is required.'
            });
        }

        if (!password) {
            return res.status(500).json({
                message: 'Password is required.'
            });
        }

        let existingUsers = fs.readFileSync(userDataPath + '/users.json', 'utf8');

        if (!existingUsers) {
            existingUsers = [];
        } else {
            existingUsers = JSON.parse(existingUsers);
            if (!Array.isArray(existingUsers)) {
                return res.status(500).json({
                    message: 'Database error.'
                });
            }
            
            const isExistedUser = existingUsers.findIndex(function(user) {
                return user.username === username;
            });

            if (isExistedUser != -1) {
                return res.status(500).json({
                    message: 'Username is existed!'
                });
            }
        }
        const newUser = {
            username,
            password
        };

        const lengthOfListUsers = existingUsers.length;
        if (lengthOfListUsers === 0) {
            newUser.id = 1;
        } else {
            newUser.id = existingUsers[lengthOfListUsers - 1].id + 1;
        }

        existingUsers.push(newUser);
        fs.writeFileSync(userDataPath + '/users.json', JSON.stringify(existingUsers, null, 2));
        
        return res.status(200).json({
            message: 'Create new user successfully.',
            data: newUser
        });
    } catch (error) {
        return res.status(400).json({
            message: 'Something went wrong!',
            err: error
        });
    }
});

// API get list users
app.get('/api/v1/users', (req, res, next) => {
    try {
        const listUsers = fs.readFileSync(userDataPath + '/users.json', 'utf8');
        if (!listUsers) {
            return res.status(500).json({
                message: 'Database error.'
            });
        }
        return res.status(200).json({
            message: 'Get list users successfully.',
            data: JSON.parse(listUsers)
        });
    } catch (error) {
        return res.status(400).json({
            message: 'Something went wrong!',
            err: error
        });
    }
});

// API update user by id
app.put('/api/v1/users/:id', (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
            return res.status(500).json({
                message: 'Id is not an integer!'
            }); 
        }

        const { username, password } = req.body;
        if (!username) {
            return res.status(500).json({
                message: 'Username cannot be empty.'
            });
        }

        if (!password) {
            return res.status(500).json({
                message: 'Password cannot be empty.'
            });
        }

        let existingUsers = fs.readFileSync(userDataPath + '/users.json', 'utf8');
        if (!existingUsers) {
            return res.status(500).json({
                message: 'Database error.'
            });
        }

        existingUsers = JSON.parse(existingUsers);
        if (!Array.isArray(existingUsers)) {
            return res.status(500).json({
                message: 'Database error.'
            });
        }
        for (let user of existingUsers) {
            if (user.id === userId) {
                const isExistedUser = existingUsers.findIndex(function(user) {
                    return user.username === username && user.id !== userId;
                });
    
                if (isExistedUser !== -1) {
                    return res.status(500).json({
                        message: 'Username is existed!'
                    });
                }

                user.username = username;
                user.password = password;
                fs.writeFileSync(userDataPath + '/users.json', JSON.stringify(existingUsers, null, 2), 'utf8');
                return res.status(200).json({
                    message: 'Update user successfully',
                    data: {
                        username,
                        password,
                        id: userId
                    }
                });
            }
        }
        return res.status(500).json({
            message: 'UserID is not existed.'
        });
    } catch (error) {
        return res.status(400).json({
            message: 'Something went wrong!',
            err: error
        });
    }
});

// API get user by id
app.get('/api/v1/users/:id', (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
            return res.status(500).json({
                message: 'Id is not an integer!'
            }); 
        }

        let listUsers = fs.readFileSync(userDataPath + '/users.json', 'utf8');
        if (!listUsers) {
            return res.status(500).json({
                message: 'Database error.'
            });
        }

        listUsers = JSON.parse(listUsers);
        if (!Array.isArray(listUsers)) {
            return res.status(500).json({
                message: 'Database error.'
            });
        }
        const user = listUsers.find(function(tempUser) {
            return tempUser.id === userId;
        });
        if (!user) {
            return res.status(500).json({
                message: 'UserID is not existed.'
            });
        }
        return res.status(200).json({
            message: 'Get user by id successfully.',
            data: user
        });
    } catch (error) {
        return res.status(400).json({
            message: 'Something went wrong!',
            err: error
        });
    }
});

// API delete user by id
app.delete('/api/v1/users/:id', (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
            return res.status(500).json({
                message: 'Id is not an integer!'
            }); 
        }

        let listUsers = fs.readFileSync(userDataPath + '/users.json', 'utf8');
        if (!listUsers) {
            return res.status(500).json({
                message: 'Database error.'
            });
        }

        listUsers = JSON.parse(listUsers);
        if (!Array.isArray(listUsers)) {
            return res.status(500).json({
                message: 'Database error.'
            });
        }
        const indexUser = listUsers.findIndex(function(user) {
            return user.id === userId;
        });
        if (indexUser === -1) {
            return res.status(500).json({
                message: 'UserID is not existed.'
            });
        }

        listUsers.splice(indexUser, 1);

        fs.writeFileSync(userDataPath + '/users.json', JSON.stringify(listUsers, null, 2), 'utf8');
        return res.status(200).json({
            message: 'Deleting user by id successfully.',
            data: listUsers
        });
    } catch (error) {
        return res.status(400).json({
            message: 'Something went wrong!',
            err: error
        });
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
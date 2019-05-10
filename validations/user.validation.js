const Joi = require('@hapi/joi');

const createUser = function() {
    return {
        body: {
            username: Joi.string().required().min(3).max(30).alphanum(),
            password: Joi.string().required().min(5).max(30)
        },
        query: {},
        params: {}
    }; 
};

const updateUser = function() {
    return {
        body: 
            Joi.object().keys({
                username: Joi.string().min(3).max(30).alphanum(),
                password: Joi.string().min(5).max(30)
            }).or('username', 'password'),
        params: {
            id: Joi.string().max(24).min(12).alphanum()
        }
    };
};

const paramId = function() {
    return {
        params: {
            id: Joi.string().max(24).min(12).alphanum()
        }
    }
};

module.exports = {
    createUser,
    updateUser,
    paramId
};
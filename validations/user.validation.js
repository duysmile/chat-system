const Joi = require('@hapi/joi');
const Constants = require('../common/constants');

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
            id: Joi.string().regex(Constants.REGEX.OBJECT_ID).required()
        }
    };
};

const paramId = function() {
    return {
        params: {
            id: Joi.string().regex(Constants.REGEX.OBJECT_ID)
        }
    }
};

module.exports = {
    createUser,
    updateUser,
    paramId
};
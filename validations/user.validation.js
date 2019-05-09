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

module.exports = {
    createUser
};
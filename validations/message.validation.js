const Joi = require('@hapi/joi');
const Constants = require('../common/constants');

const createMessage = function() {
    return {
        body: {
            content: Joi.string().min(1).max(3000).required(),
            room: Joi.string().regex(Constants.REGEX.OBJECT_ID).required()
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

const update = function() {
    return {
        body: Joi.object().keys({
            // author: Joi.string().regex(Constants.REGEX.OBJECT_ID),
            content: Joi.string().min(1).max(3000),
            // room: Joi.string().regex(Constants.REGEX.OBJECT_ID)
        }).or('content'),
        params: {
            id: Joi.string().regex(Constants.REGEX.OBJECT_ID)
        }
    } 
};

module.exports = {
    createMessage,
    paramId,
    update
};
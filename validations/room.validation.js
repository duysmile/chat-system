const Joi = require('@hapi/joi');
const Constants = require('../common/constants');

const createRoom = function() {
    return {
        body: {
            name: Joi.string().alphanum().max(100).required(),
            members: Joi.array().items(Joi.string().regex(Constants.REGEX.OBJECT_ID)).required().min(2).max(10),
            lastMessage: Joi.string().regex(Constants.REGEX.OBJECT_ID),
            type: Joi.string().valid(['individual', 'room']).required()
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
            name: Joi.string().alphanum().max(100),
            members: Joi.array().items(Joi.string().regex(Constants.REGEX.OBJECT_ID)).min(2).max(10),
            lastMessage: Joi.string().regex(Constants.REGEX.OBJECT_ID),
            type: Joi.string().valid(['individual', 'room'])
        }).or('name', 'author', 'members', 'lastMessage', 'type'),
        params: {
            id: Joi.string().regex(Constants.REGEX.OBJECT_ID)
        }
    } 
};

module.exports = {
    createRoom,
    paramId,
    update
};
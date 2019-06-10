const Joi = require('@hapi/joi');
const Constants = require('../common/constants');

const createRoom = function() {
    return {
        body: {
            name: Joi.string().alphanum().max(100).required(),
            members: Joi.array().items(Joi.string().regex(Constants.REGEX.OBJECT_ID)).required().max(10),
            lastMessage: Joi.string().regex(Constants.REGEX.OBJECT_ID),
            type: Joi.string().valid(['individual', 'room']).required()
        }
    };
};

const getRooms = function() {
    return {
        query: Joi.object().keys({
            page: Joi.number().default(1),
            limit: Joi.number().max(100).default(10)
        })
    }
}

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
            members: Joi.array().items(Joi.string().regex(Constants.REGEX.OBJECT_ID)).max(10),
            lastMessage: Joi.string().regex(Constants.REGEX.OBJECT_ID),
            type: Joi.string().valid(['individual', 'room'])
        }).or('name', 'author', 'members', 'lastMessage', 'type'),
        params: {
            id: Joi.string().regex(Constants.REGEX.OBJECT_ID)
        }
    } 
};

const getMessages = function() {
    return {
        query: Joi.object().keys({
            page: Joi.number().default(1),
            limit: Joi.number().max(100).default(10)
        }),
        params: {
            id: Joi.string().regex(Constants.REGEX.OBJECT_ID)
        }
    }
};

module.exports = {
    createRoom,
    paramId,
    update,
    getRooms,
    getMessages
};
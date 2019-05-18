const Joi = require('@hapi/joi');
const Constants = require('../common/constants');

const createProduct = function() {
    return {
        body: {
            name: Joi.string().alphanum().min(3).max(100).required(),
            user: Joi.string().regex(Constants.REGEX.OBJECT_ID).required(),
            price: Joi.number().integer().min(1000).max(1000000000).required(),
            colors: Joi.array().items(Joi.string().alphanum().min(3).max(30)).required(),
            isAvailable: Joi.boolean().required(),
            payload: Joi.object().keys({
                releasedAt: Joi.date().required(),
                expiredAt: Joi.date().required().greater(Joi.ref('releasedAt'))
            })
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
            name: Joi.string().alphanum().min(3).max(100),
            user: Joi.string().regex(Constants.REGEX.OBJECT_ID),
            price: Joi.number().integer().min(1000).max(1000000000),
            colors: Joi.array().items(Joi.string().alphanum().min(3).max(30)),
            isAvailable: Joi.boolean(),
            payload: Joi.object().keys({
                expiredAt: Joi.date().when('releasedAt', { is: Joi.exist(), then: Joi.date().greater(Joi.ref('releasedAt')) }),
                releasedAt: Joi.date()
            })
        }).or('name', 'userId', 'price', 'colors', 'isAvailable', 'payload'),
        params: {
            id: Joi.string().regex(Constants.REGEX.OBJECT_ID)
        }
    } 
};

module.exports = {
    createProduct,
    paramId,
    update
};
const Joi = require('@hapi/joi');

const createProduct = function() {
    return {
        body: {
            name: Joi.string().alphanum().min(3).max(100).required(),
            userId: Joi.string().max(24).min(12).alphanum().required(),
            price: Joi.number().integer().min(1000).max(1000000000).required(),
            colors: Joi.array().items(Joi.string().alphanum().min(3).max(30)).required(),
            isAvailable: Joi.boolean().required(),
            payload: Joi.object().keys({
                expiredAt: Joi.date().required(),
                releasedAt: Joi.date().required()
            })
        }
    };
};

const paramId = function() {
    return {
        params: {
            id: Joi.string().min(12).max(24).alphanum()
        }
    }
};

const update = function() {
    return {
        body: Joi.object().keys({
            name: Joi.string().alphanum().min(3).max(100),
            userId: Joi.string().max(24).min(12).alphanum(),
            price: Joi.number().integer().min(1000).max(1000000000),
            colors: Joi.array().items(Joi.string().alphanum().min(3).max(30)),
            isAvailable: Joi.boolean(),
            payload: Joi.object().keys({
                expiredAt: Joi.date(),
                releasedAt: Joi.date()
            })
        }).or('name', 'userId', 'price', 'colors', 'isAvailable', 'payload'),
        params: {
            id: Joi.string().min(12).max(24).alphanum()
        }
    } 
};

module.exports = {
    createProduct,
    paramId,
    update
};
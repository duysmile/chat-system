const Constants = require('../common/constants');
const ResponseSuccess = require('../helpers/response.helper');
const Room = require('../models/room');
const Message = require('../models/Message');
const _ = require('lodash');

const conditionNotDeleted = { 
    deletedAt: { $exists: false },
};

const getAll = async function(req, res, next) {
    try {
        let { page, limit } = req.query;
        page = page || 1;
        limit = limit || 10;
        const skip = (page - 1)  * limit;
        const messages = await Message.find(conditionNotDeleted)
            .skip(+skip)
            .limit(+limit)
            .populate([
                {
                    path: 'author',
                    select: '_id username'
                },
            ])
            .lean();

        return ResponseSuccess('Get list messages successfully', messages, res);
    } catch(error) {
        return next(error);
    }
};

const create =  async function(req, res, next) {
    try {
        const {
            author,
            content,
            room
        } = req.body;
        
        const existedRoom = await Room.findById(room).lean();
        if (!existedRoom) {
            return next(new Error('NOT_EXISTED_ROOM'));
        }
        const message = new Message({
            author,
            content,
            room
        });
        const resultCreateMessage = await message.save();
        await Room.updateOne({ _id: room }, {
            lastMessage: resultCreateMessage.toObject()._id
        });
        return ResponseSuccess('Create message successfully', resultCreateMessage.toObject(), res);
    } catch (error) {
        return next(error);
    }
};

const getById = async function(req, res, next) {
    try {
        const { id } = req.params;
        const { author } = req.body;
        const message = await Message.findOne({ 
            ...conditionNotDeleted, 
            _id: id,
            author: author
        })
            .populate([
                {
                    path: 'author',
                    select: '_id username'
                }
            ])
            .lean();
        if (!message) {
            return next(new Error('MessageID is not existed!'));
        }

        return ResponseSuccess('Get message by Id successfully', message, res);
    } catch (error) {
        return next(error);
    }
};

const update = async function(req, res, next) {
    try {
        const { id } = req.params;
        const {
            author,
            content,
            // room
        } = req.body;

        let newMessage = {
            // author,
            content,
            // room
        };

        const message = await Message.findOneAndUpdate({ 
            ...conditionNotDeleted, 
            _id: id,
            author: author
        }, newMessage, { new:true, overwrite: true }).lean();
        if (!message) {
            return next(new Error('MessageId is not existed!'));
        }

        return ResponseSuccess('Update message successfully!', message, res);
    } catch (error) {
        return next(error);
    }
};

const deleteById = async function(req, res, next) {
    try {
        const { id } = req.params;
        const { author } = req.body;
        const message = await Message.findOneAndUpdate({ 
            ...conditionNotDeleted, 
            _id: id,
            author: author
        }, {
            $set: {
                deletedAt: new Date()
            }
        }, { new:true, overwrite: true }).lean();
        
        if (!message) {
            return next(new Error('roomID is not existed!'));
        }

        return ResponseSuccess('Delete room by Id successfully', message, res);
    } catch (error) {
        return next(error);
    }
};

const getByRoom = async (req, res, next) => {
    try {
        const { author } = req.body;
        const room = req.params.id;
        const existedRoom = await Room.findOne({ 
            _id: room,
            members: author
        }).select('_id').lean();
        if (!existedRoom) {
            return next(new Error('NOT_EXISTED_ROOM'));
        }

        let { page, limit } = req.query;
        page = page || 1;
        limit = limit || 10;
        const skip = (page - 1) * limit;
        const messages = await Message.find({ room })
            .skip(+skip)
            .limit(+limit)
            .select('content author')
            .populate({
                path: 'author',
                select: 'username'
            })
            .sort('createdAt')
            .lean();

        return ResponseSuccess('Get list message in room succcessfully', messages, res);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getAll,
    create,
    getById,
    update,
    deleteById,
    getByRoom
};

const Constants = require('../common/constants');
const ResponseSuccess = require('../helpers/response.helper');
const Room = require('../models/room');
const User = require('../models/user');
const Message = require('../models/Message');
const _ = require('lodash');

const conditionNotDeleted = { 
    deletedAt: { $exists: false },
};

const getAll = async function(req, res, next) {
    try {
        const { author } = req.body;
        let { page, limit } = req.query;
        page = page || 1;
        limit = limit || 10; 
        const skip = (page - 1) * limit;
        const rooms = await Room.find({ ...conditionNotDeleted, author })
            .skip(+skip)
            .limit(+limit)
            .populate([
                {
                    path: 'author',
                    select: 'username'
                },
                {
                    path: 'members',
                    select: 'username'
                },
                {
                    path: 'lastMessage',
                    select: 'author content',
                    populate: {
                        path: 'author',
                        select: 'username'
                    }
                }
            ])
            .lean();

        return ResponseSuccess('Get list rooms successfully', rooms, res);
    } catch(error) {
        return next(error);
    }
};

const create =  async function(req, res, next) {
    try {
        const {
            name,
            author,
            members,
            lastMessage,
            type
        } = req.body;
        // remove all duplicate member
        let listMembers = Array.from(new Set(members));
        const existedMembers = await User.countDocuments({ ...conditionNotDeleted, _id: { $in: members } });

        if (existedMembers !== members.length) {
            return next(new Error('A member in list is not existed!'));
        }

        const existedAuthorInMembers = members.find(item => item === author);
        if (!existedAuthorInMembers) {
            listMembers = listMembers.concat(author);
        }
        
        const room = new Room({
            name,
            author,
            members,
            lastMessage,
            type
        });
        const resultCreateRoom = await room.save();
        return ResponseSuccess('Create room successfully', resultCreateRoom.toObject(), res);
    } catch (error) {
        return next(error);
    }
};

const getById = async function(req, res, next) {
    try {
        const { id } = req.params;
        const { author } = req.body;
        const room = await Room.findOne({ 
            ...conditionNotDeleted, 
            _id: id,
            author: author
        })
            .populate([
                {
                    path: 'author',
                    select: 'username'
                },
                {
                    path: 'members',
                    select: 'username'
                },
                {
                    path: 'lastMessage',
                    select: 'author content',
                    populate: {
                        path: 'author',
                        select: 'username'
                    }
                }
            ])
            .lean();
        if (!room) {
            return next(new Error('RoomID is not existed!'));
        }

        return ResponseSuccess('Get room by Id successfully', room, res);
    } catch (error) {
        return next(error);
    }
};

const update = async function(req, res, next) {
    try {
        const { id } = req.params;
        const {
            name,
            author,
            members,
            lastMessage,
            type
        } = req.body;

        const existedUsers = await User.find({ 
            ...conditionNotDeleted, 
            _id: { $in: member }
        }).lean();
        if (!existedUsers) {
            return next(new Error('A member in list is not existed!'));
        }
        
        let newRoom = {
            name,
            author,
            members,
            lastMessage,
            type
        };

        // Object.keys(newroom).forEach(function(key) {
        //     if (newroom[key] === undefined) {
        //         delete newroom[key];
        //     }
        // });
        newRoom = _.omitBy(newRoom, _.isNil);

        const room = await Room.findOneAndUpdate({ 
            ...conditionNotDeleted, 
            _id: id,
            author: author 
        }, newRoom, { 
            new:true, 
            overwrite: true 
        }).lean();
        if (!room) {
            return next(new Error('RoomId is not existed!'));
        }

        return ResponseSuccess('Update room successfully!', room, res);
    } catch (error) {
        return next(error);
    }
};

const deleteById = async function(req, res, next) {
    try {
        const { id } = req.params;
        const room = await Room.findOneAndUpdate({ 
            ...conditionNotDeleted, 
            _id: id,
            author: author
        }, {
            $set: {
                deletedAt: new Date()
            }
        }, { new:true, overwrite: true }).lean();
        
        if (!room) {
            return next(new Error('roomID is not existed!'));
        }

        await Message.updateMany({ room: room._id }, {
            $set: {
                deletedAt: new Date()
            }
        });

        return ResponseSuccess('Delete room by Id successfully', room, res);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getAll,
    create,
    getById,
    update,
    deleteById
};

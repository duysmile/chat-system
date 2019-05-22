const Constants = require('../common/constants');
const ResponseSuccess = require('../helpers/response.helper');
const Room = require('../models/room');
const User = require('../models/user');
const _ = require('lodash');

const conditionNotDeleted = { 
    deletedAt: { $exists: false },
};

const getAll = async function(req, res, next) {
    try {
        const rooms = await Room.find(conditionNotDeleted)
            .populate([
                {
                    path: 'author',
                    select: '_id username'
                },
                {
                    path: 'members',
                    select: '_id username'
                },
                {
                    path: 'lastMessage',
                    select: 'author content'
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
        const room = await room.findOne({ ...conditionNotDeleted, _id: id })
            .populate([
                {
                    path: 'author',
                    select: '_id username'
                },
                {
                    path: 'members',
                    select: '_id username'
                },
                {
                    path: 'lastMessage',
                    select: 'author content',
                    populate: {
                        path: 'author',
                        select: '_id username'
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
            members,
            lastMessage,
            type
        } = req.body;

        const existedUsers = await User.find({ ...conditionNotDeleted, _id: { $in: member }}).lean();
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

        const room = await room.findOneAndUpdate({ ...conditionNotDeleted, _id: id }, newRoom, { new:true, overwrite: true }).lean();
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
        const room = await room.findOneAndUpdate({ ...conditionNotDeleted, _id: id }, {
            $set: {
                deletedAt: new Date()
            }
        }, { new:true, overwrite: true }).lean();
        
        if (!room) {
            return next(new Error('roomID is not existed!'));
        }

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

const Constants = require('../common/constants');
const { ResponseSuccess } = require('../helpers/response.helper');
const { roomRepository, userRepository, messageRepository } = require('../repositories');

const getAll = async function(req, res, next = function(err) {
    return Promise.reject(err);
}) {
    try {
        const author = req.user._id;
        let { page, limit } = req.query;
        
        const rooms = await roomRepository.getAll({
            page,
            limit,
            where: {
                members: author
            },
            populate: [
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
                    select: 'author content createdAt',
                    populate: {
                        path: 'author',
                        select: 'username'
                    }
                }
            ]
        });

        return ResponseSuccess('Get list rooms successfully', rooms, res);
    } catch(error) {
        return next(error);
    }
};

const create =  async function(req, res, next = function(err) {
    return Promise.reject(err);
}) {
    try {

        const author = req.user._id;
        const {
            name,
            members,
            lastMessage,
            type
        } = req.body;

        // remove all duplicate member
        let listMembers = Array.from(new Set(members));
        const existedMembers = await userRepository.count({ 
            _id: { 
                $in: members 
            } 
        });

        if (existedMembers !== members.length) {
            return next(new Error('A member in list is not existed!'));
        }

        const isExistedAuthorInMembers = members.includes(author);
        if (!isExistedAuthorInMembers) {
            listMembers = listMembers.concat(author);
        }
        
        const room = await roomRepository.create({
            name,
            author,
            type,
            lastMessage,
            members: listMembers
        })
        
        return ResponseSuccess('CREATE_ROOM_SUCCESS', room, res);
    } catch (error) {
        return next(error);
    }
};

const getById = async (req, res, next = function(err) {
    return Promise.reject(err);
}) => {
    try {
        const author = req.user._id;
        const room = req.params.id;
        const existedRoom = await roomRepository.getOne({
            where: { 
                _id: room,
                members: author
            },
            fields: '_id name'
        });
        if (!existedRoom) {
            return next(new Error('NOT_EXISTED_ROOM'));
        }

        let { page, limit } = req.query;
        
        const messages = await messageRepository.getAll({
            where: { 
                room
            },
            page: page,
            limit: limit,
            fields: 'createdAt content author',
            populate: {
                path: 'author',
                select: 'username'
            },
            sort: '-createdAt'
        });

        existedRoom.messages = messages;

        return ResponseSuccess('GET_ROOM_SUCCESS', existedRoom, res);
    } catch (error) {
        return next(error);
    }
};

const deleteById = async function(req, res, next = function(err) {
    return Promise.reject(err);
}) {
    try {
        const author = req.user._id;        
        const { id } = req.params;
        const room = await roomRepository.deleteOne({ 
            _id: id,
            author: author
        });
        
        if (room.n === 0) {
            return next(new Error('NOT_EXISTED_ROOM'));
        }

        await messageRepository.deleteMany({
            room: room._id
        });

        return ResponseSuccess('DELETE_ROOM_SUCCESS', room, res);
    } catch (error) {
        return next(error);
    }
};

const inviteMembersToGroup = async (req, res, next = function(err) {
    return Promise.reject(err);
}) => {
    try {
        const { id } = req.params;
        const {
            members,
        } = req.body;
        const author = req.user._id;

        const listMember = Array.from(new Set(members));
        const countExistedUsers = await userRepository.count({ 
            _id: listMember
        });

        if (countExistedUsers < listMember.length) {
            return next(new Error('NOT_EXISTED_MEMBERS'));
        }

        const room = await roomRepository.addMember({ author, id, members });

        if (!room) {
            return next(new Error('NOT_EXISTED_ROOM'));
        }

        return ResponseSuccess('INVITE_MEMBER_SUCCESS', room, res);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getAll,
    create,
    getById,
    inviteMembersToGroup,
    deleteById
};

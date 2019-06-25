const BaseRepository = require('./base.repository');
const Room = require('../models/room');

module.exports = class RoomRepository extends BaseRepository {
    constructor() {
        super('Room');
    }

    async getAll(options) {
        const rooms = await super.getAll(options);
        return rooms.map(room => {
            room.name = room.name || getNameRoom(room.members, options.author.toString(), room.type);
            return room;
        })
    }

    async getOne(options) {
        const room = await super.getOne(options);
        room.name = room.name || getNameRoom(room.members, options.author.toString(), room.type);
        return room;
    }

    async create({ members, name, author, type, lastMessage }) {
        if (type === 'individual') {
            const existedRoom = await Room.findOne({
                members
            }).lean();
            if (existedRoom) {
                return existedRoom;
            }
        }

        if (members.length < 1) {
            throw new Error('NOT_VALID_MEMBERS');
        }

        const room = await Room.create({
            name,
            author,
            members,
            lastMessage,
            type
        });
        room.name = room.name || getNameRoom(members, author, type);
        return room.toObject();
    }

    async addMember({ author, id, members }) {
        const checkRoom = await this.getOne({ 
            where: {
                author,
                _id: id,
                members: {
                    $all: members
                }
            }
        });
        if (!!checkRoom) {
            throw new Error('MEMBERS_ARE_EXISTED_ROOM');
        }

        const room = await this.getOneAndUpdate({
            where: {
                author,
                _id: id
            },
            data: {
                $addToSet: {
                    members: members
                }
            }
        });
        return room;
    }
};

function getNameRoom(members, author, type) {
    if (type === 'individual') {
        if (members.length === 1) {
            return members[0].username;
        }
        return members.find(member => member._id.toString() !== author).username;
    }
    return members.reduce((result, member, index) => {
        if (index === 0) {
            return member.username;
        }
        if (member._id.toString() === author.toString()) {
            return result;
        }
        return result + ', ' + member.username;
    }, '');
}

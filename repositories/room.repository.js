const BaseRepository = require('./base.repository');
const Room = require('../models/room');

module.exports = class RoomRepository extends BaseRepository {
    constructor() {
        super(Room);
    }

    async create({ members, name, author, type, lastMessage }) {
        if (type === 'individual') {
            const existedRoom = await Room.findOne({
                members: {
                    $all: members
                }
            }).lean();
            if (existedRoom) {
                return existedRoom;
            }
        }

        if (members.length <= 1) {
            throw new Error('NOT_VALID_MEMBERS');
        }

        const room = await Room.create({
            name,
            author,
            members,
            lastMessage,
            type
        });
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
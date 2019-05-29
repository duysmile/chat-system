const BaseRepository = require('./base.repository');
const Message = require('../models/message');

module.exports = class MessageRepository extends BaseRepository {
    constructor() {
        super(Message);
    }
}
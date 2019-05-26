const messageController = require('../controllers/message.controller');
const messageValidation = require('../validations/message.validation');
const validate = require('express-validation');
const chatMiddleware = require('../middlewares/chat.middleware');

exports.load = (app) => {
    app.use('/api/v1/messages*', chatMiddleware.getUserData);
    app.get('/api/v1/messages', messageController.getAll);
    app.get('/api/v1/messages/:id', validate(messageValidation.paramId()), messageController.getById);
    app.delete('/api/v1/messages/:id', validate(messageValidation.paramId()), messageController.deleteById);
    app.post('/api/v1/messages', validate(messageValidation.createMessage()), messageController.create);
    app.put('/api/v1/messages/:id', validate(messageValidation.update()), messageController.update);
    app.get('/api/v1/rooms/:id/messages', validate(messageValidation.paramId), messageController.getByRoom);
};

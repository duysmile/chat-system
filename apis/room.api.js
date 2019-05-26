const roomController = require('../controllers/room.controller');
const roomValidation = require('../validations/room.validation');
const validate = require('express-validation');
const roomMiddleware = require('../middlewares/chat.middleware');

exports.load = (app) => {
    app.use('/api/v1/rooms*', roomMiddleware.getUserData);
    app.get('/api/v1/rooms', roomController.getAll);
    app.get('/api/v1/rooms/:id', validate(roomValidation.paramId()), roomController.getById);
    app.delete('/api/v1/rooms/:id', validate(roomValidation.paramId()), roomController.deleteById);
    app.post('/api/v1/rooms', validate(roomValidation.createRoom()), roomController.create);
    app.put('/api/v1/rooms/:id', validate(roomValidation.update()), roomController.update);
};

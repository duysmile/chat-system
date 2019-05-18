const userController = require('../controllers/user.controller');
const userValidation = require('../validations/user.validation');   
const validate = require('express-validation');
const authenMiddleware = require('../middlewares/authentication.middleware');
const router = require('express').Router();

// API create new user
router.post('', validate(userValidation.createUser()), userController.createUser);

router.use(authenMiddleware.verifyToken);
// API get list users
router.get('', userController.getListUsers);

// API update user by id
router.put('/:id', validate(userValidation.updateUser()), userController.updateUser);

// API get user by id
router.get('/:id', validate(userValidation.paramId()), userController.getUserById);

// API delete user by id
router.delete('/:id', validate(userValidation.paramId()), userController.deleteUser);

module.exports = router;

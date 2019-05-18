const loginController = require('../controllers/login.controller');
const router = require('express').Router();

router.post('', loginController.login);

module.exports = router;
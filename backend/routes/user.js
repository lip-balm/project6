// the router takes the request and decides which controller/controller methods will handle the request.

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/signup', userController.signup);
router.post('/login', userController.login);

module.exports = router;
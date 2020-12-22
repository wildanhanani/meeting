const express = require('express');
const userController = require('../controller/user');

const router = express.Router();

router.post('/user/create', userController.createuser);
router.post('/login', userController.login);

module.exports = router;

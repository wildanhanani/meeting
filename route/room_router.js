const express = require('express');
const roomController = require('../controller/room');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/room/create', auth.admin, roomController.createroom);
router.get('/room/available-room', roomController.availableRoom);

module.exports = router;

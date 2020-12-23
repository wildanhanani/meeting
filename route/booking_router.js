const express = require('express');
const bookingController = require('../controller/booking');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/booking/create', auth.guest, bookingController.booking);
router.post('/booking/checkin', auth.admin, bookingController.checkin);
router.post('/booking/checkout', auth.admin, bookingController.checkout);

module.exports = router;

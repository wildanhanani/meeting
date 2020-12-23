const nodemailer = require('nodemailer');
const { data_notfound, authorized, respone_ok_data } = require('../helper/http_response');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Users = require('../models/Users');

const transport = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '92e13e3e32ca80',
    pass: '39b02eadce4dd9',
  },
});

exports.booking = async (req, res, next) => {
  try {
    const { roomId, total, booking_time, noted } = req.body;
    const Datenow = new Date(booking_time).toISOString();
    const email = await Users.findByPk(req.user.id);
    const mailOptions = {
      from: 'smtp.mailtrap.io',
      to: email.email,
      subject: 'Booking room',
      text: 'Success booking room',
    };
    const room = await Room.findByPk(roomId);
    if (room === null) {
      return data_notfound(res, 'room not found');
    }
    if (room.status === 'not available') {
      return authorized(res, 'this room not available');
    }
    if (total > room.capacity) {
      return authorized(res, 'over capacity, please check this capacity in room');
    }
    const booking = await Booking.create({
      user_id: req.user.id,
      room_id: roomId,
      total_person: total,
      booking_time: Datenow,
      noted: noted,
    });
    if (booking) {
      await Room.update({ status: 'not available' }, { where: { id: roomId } });
      await transport.sendMail(mailOptions);
    }
    respone_ok_data(res, 'success booking room, please check email', booking);
  } catch (error) {
    next(error);
  }
};

exports.checkin = async (req, res, next) => {
  try {
    const { user } = req.body;
    const findbooking = await Booking.findOne({ where: { user_id: user } });
    if (findbooking === null) {
      return data_notfound(res, 'booking not found');
    }
    const date = new Date();

    //format waktu terkini indonesia
    const datenow = Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(0, 0, 0, 0) + 7,
      date.getUTCMinutes(),
      date.getUTCSeconds(),
    );

    const checkin = await Booking.update({ check_in_time: datenow }, { where: { user_id: user } });
    const email = await Users.findOne({ where: { id: user } });
    const mailOptions = {
      from: 'smtp.mailtrap.io',
      to: email.email,
      subject: 'checkin room',
      text: 'Success checkin room',
    };
    if (checkin) {
      await transport.sendMail(mailOptions);
    }

    res.status(200).json({
      status: 200,
      msg: 'succes check in, please check email',
    });
  } catch (error) {
    next(error);
  }
};

exports.checkout = async (req, res, next) => {
  try {
    const { room } = req.body;
    const findbooking = await Booking.findOne({ where: { room_id: room } });
    if (findbooking === null) {
      return data_notfound(res, 'booking not found or not chek in');
    }
    const date = new Date();
    const datenow = Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(0, 0, 0, 0) + 7,
      date.getUTCMinutes(),
      date.getUTCSeconds(),
    );

    await Booking.update({ check_out_time: datenow }, { where: { room_id: room } });
    await Room.update({ status: 'available' }, { where: { id: room } });

    res.status(200).json({
      status: 200,
      msg: 'succes check out, thank you',
    });
  } catch (error) {
    next(error);
  }
};

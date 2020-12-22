const JWT = require('jsonwebtoken');
const User = require('../models/Users');
const { authorized, data_notfound, forbidden, validasi_data } = require('../helper/http_response');

const JWTSecret = process.env.JWT_KEY;
exports.admin = async (req, res, next) => {
  try {
    const headers = req.headers.authorization;
    if (!headers) {
      return forbidden(res, 'please provide token');
    }

    const token = headers.split(' ')[1];
    const decode = JWT.verify(token, JWTSecret);
    req.user = decode;

    const find = await User.findByPk(req.user.id);

    if (!find) {
      return data_notfound(res, 'User not found');
    }
    if (req.user.role !== 'admin') {
      return authorized(res, 'User is not acces');
    }
    next();
  } catch (error) {
    return validasi_data(res, 'validation error', error.message);
  }
};

exports.guest = async (req, res, next) => {
  try {
    const headers = req.headers.authorization;
    if (!headers) {
      return forbidden(res, 'please provide token');
    }

    const token = headers.split(' ')[1];
    const decode = JWT.verify(token, JWTSecret);
    req.user = decode;

    const find = await User.findByPk(req.user.id);
    if (!find) {
      return data_notfound(res, 'User not found');
    }
    if (req.user.role !== 'guest') {
      return authorized(res, 'User is not acces');
    }
    next();
  } catch (error) {
    return validasi_data(res, 'validation error', error.message);
  }
};

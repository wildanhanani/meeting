const dotenv = require('dotenv');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const pify = require('pify');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Users = require('../models/Users');
const { data_notfound, validasi, authorized, respone_ok_data } = require('../helper/http_response');

dotenv.config();
const JWTsecret = process.env.JWT_KEY;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
const storage = multer.diskStorage({
  destination: 'upload',
  filename: (req, file, cb) => cb(null, file.originalname),
});

const upload = pify(
  multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
      } else {
        cb(null, false);
        req.fileValidationError = 'Only .png, .jpg, and .jpeg format allowed!';
      }
    },
    limits: { fileSize: 1024 * 1024 * 2 },
  }).single('file'),
);

exports.createuser = async (req, res, next) => {
  try {
    // upload file in cloudinary
    await upload(req, res);
    const { path } = req.file;
    const uploadPreset = 'upload_preset';

    const getUrl = async () => {
      let data;
      await cloudinary.uploader.unsigned_upload(path, uploadPreset, (err, result) => {
        fs.unlinkSync(path);
        data = result.secure_url;
      });
      return data;
    };

    const photo = await getUrl();
    const { email, password, role } = req.body;
    const findemail = await Users.findOne({ where: { email: email } });
    if (findemail) {
      return authorized(res, 'email has been register');
    }
    // encrypt password
    const passwordHash = bcrypt.hashSync(password, 10);
    // insert data user
    const user = await Users.create({ email: email, password: passwordHash, photo: photo, role });
    respone_ok_data(res, 'success created user', user);
  } catch (error) {
    // handle error upload in cloudinary
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ status: 400, error: error.message });
    }
    // handle file image .png .jpg and .jpeg
    if (req.fileValidationError) {
      // eslint-disable-next-line no-undef
      return res.status(400).json({ status: 400, error: req.fileValidationError });
    }
    // handle file is required
    if (!req.file) {
      return res.status(400).json({ status: 400, error: 'please input file' });
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const login = await Users.findOne({ where: { email: email } });
    if (!login) {
      return data_notfound(res, 'email not found');
    }
    const compare = bcrypt.compareSync(password, login.password);
    if (!compare) {
      return validasi(res, 'password not match');
    }
    const token = JWT.sign({ id: login.id, role: login.role }, JWTsecret, { expiresIn: '24h' });
    respone_ok_data(res, 'succes login', token);
  } catch (error) {
    next(error);
  }
};

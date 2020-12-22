const dotenv = require('dotenv');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const pify = require('pify');

const { data_notfound, validasi, authorized, respone_ok_data } = require('../helper/http_response');
const Room = require('../models/Room');

dotenv.config();

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

exports.createroom = async (req, res, next) => {
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
    const { name, capacity, status } = req.body;
    const findroom = await Room.findOne({ where: { room_name: name } });
    if (findroom) {
      return authorized(res, 'name already exist');
    }
    // insert data room
    const room = await Room.create({ room_name: name, room_capacity: capacity, photo: photo, status });
    respone_ok_data(res, 'success created room', room);
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

exports.availableRoom = async (req, res, next) => {
  try {
    const room = await Room.findAll({ where: { status: 'available' } });
    respone_ok_data(res, 'available room founded', room);
  } catch (error) {
    next(error);
  }
};

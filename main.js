const express = require('express');
const dotenv = require('dotenv');
const route_user = require('./route/user_router');
const route_room = require('./route/room_router');

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB Connection
require('./connection/connection');

app.get('/', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'system register meeting up and running',
    environment: process.env.NODE_ENV,
    timestamp: new Date(),
  });
});

app.use('/api/auth', route_user);
app.use('/api', route_room);

app.use((req, res, next) => {
  const error = new Error('not found');
  error.status = 400;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    status: error.status || 500,
    error: error.message,
  });
});

app.listen(PORT, console.log(`listening to PORT ${PORT}`));

module.exports = app;

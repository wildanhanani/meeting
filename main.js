const express = require('express');
const dotenv = require('dotenv');

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

app.get('/', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'system register meeting up and running',
    environment: process.env.NODE_ENV,
    timestamp: new Date(),
  });
});

app.listen(PORT, console.log(`listening to PORT ${PORT}`));

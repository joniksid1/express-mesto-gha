const { HTTP_STATUS_NOT_FOUND } = require('http2').constants;
const express = require('express');
const { json } = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const { router } = require('./routes/root');

const { PORT = '3000', MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

app.use(json());

app.use('/', router);

app.use((req, res, next) => {
  res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Страница не найдена' });

  next();
});

mongoose.connect(MONGO_URL);

app.listen(PORT);

const express = require('express');

const { json } = require('express');

const mongoose = require('mongoose');

require('dotenv').config();

const { userRouter } = require('./routes/users');

const { cardRouter } = require('./routes/cards');

const { PORT = '3000', MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

app.use(json());

app.use((req, res, next) => {
  req.user = {
    _id: '656c8d540750056ac41f9001',
  };

  next();
});

app.use('/users', userRouter);

app.use('/cards', cardRouter);

app.use((req, res, next) => {
  res.status(404).send({ message: 'Страница не найдена' });

  next();
});

mongoose.connect(MONGO_URL);

app.listen(PORT);

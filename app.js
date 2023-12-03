const express = require('express');

const { json } = require('express');

const mongoose = require('mongoose');

require('dotenv').config();

const { userRouter } = require('./routes/users');

const { PORT, MONGO_URL } = process.env;

const app = express();

app.use(json());

app.use((req, res, next) => {
  req.user = {
    _id: '656c8d540750056ac41f9001',
  };

  next();
});

app.use('/users', userRouter);

mongoose.connect(MONGO_URL);

app.listen(PORT);

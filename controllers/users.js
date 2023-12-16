const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_UNAUTHORIZED,
} = require('http2').constants;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFoundError } = require('../utils/not-found-error');
const { updateUser } = require('../utils/update-user');
// Дефолтное значение NODE_ENV и JWT_SECRET для прохождения автотестов, т.к. они не видят .env
const { NODE_ENV = 'production', JWT_SECRET = 'some-secret-key' } = process.env;

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(HTTP_STATUS_OK).send(users);
  } catch (e) {
    return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера', error: e.message });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).orFail(() => new NotFoundError({ message: 'Пользователь по указанному ID не найден' }));
    return res.status(HTTP_STATUS_OK).send(user);
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Передан невалидный ID' });
    } if (e instanceof NotFoundError) {
      return res.status(e.statusCode).send({ message: e.message });
    }
    return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера', error: e.message });
  }
};

module.exports.getCurrenUser = async (req, res) => {
  try {
    const currentUser = await User.findOne({ _id: req.user._id });

    return res.send(currentUser);
  } catch (e) {
    if (e instanceof NotFoundError) {
      return res.status(e.statusCode).send({ message: e.message });
    }
    return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера', error: e.message });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    });

    return res.status(HTTP_STATUS_CREATED).send(user);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Ошибка валидации полей', ...e });
    }
    return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера', error: e.message });
  }
};

module.exports.updateUserData = async (req, res) => {
  try {
    const { name, about } = req.body;
    const updatedUser = await updateUser(req.user._id, { name, about });
    return res.status(HTTP_STATUS_OK).send(updatedUser);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Ошибка валидации полей', ...e });
    } return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера', error: e.message });
  }
};

module.exports.updateUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    await updateUser(req.user._id, { avatar });
    return res.status(HTTP_STATUS_OK).send({ message: 'Аватар успешно обновлён' });
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Ошибка валидации полей', ...e });
    } return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера', error: e.message });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' },
    );

    res
      .cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
      .end();
  } catch (e) {
    res.status(HTTP_STATUS_UNAUTHORIZED).send({ message: e.message });
  }
};

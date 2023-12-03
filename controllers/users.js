const User = require('../models/user');
const { NotFoundError } = require('../utils/not-found-error');

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).send(users);
  } catch (e) {
    return res.status(500).send({ message: 'Ошибка на стороне сервера', error: e.message });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).orFail(() => new NotFoundError({ message: 'Пользователь по указанному ID не найден' }));
    return res.status(200).send(user);
  } catch (e) {
    switch (e.name) {
      case 'CastError':
        return res.status(400).send({ message: 'Передан невалидный ID' });
      case 'NotFoundError':
        return res.status(e.statusCode).send({ message: e.message });
      default:
        return res.status(500).send({ message: 'Ошибка на стороне сервера', error: e.message });
    }
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    return res.status(201).send(newUser);
  } catch (e) {
    switch (e.name) {
      case 'ValidationError':
        return res.status(400).send({ message: 'Ошибка валидации полей', ...e });
      case 'MongoServerError':
        if (e.errorCode === '11000') {
          return res.status(e.statusCode).send({ message: 'Пользователь уже существует' });
        }
        return res.status(500).send({ message: 'Ошибка на стороне сервера' });
      default:
        return res.status(500).send({ message: 'Ошибка на стороне сервера', error: e.message });
    }
  }
};

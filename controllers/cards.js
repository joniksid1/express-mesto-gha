const Card = require('../models/card');

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(200).send(cards);
  } catch (e) {
    return res.status(500).send({ message: 'Ошибка на стороне сервера', error: e.message });
  }
};

module.exports.createCard = async (req, res) => {
  try {
    const owner = req.user._id;
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner });
    return res.send(card);
  } catch (e) {
    switch (e.name) {
      case 'ValidationError':
        return res.status(400).send({ message: 'Ошибка валидации полей', ...e });
      default:
        return res.status(500).send({ message: 'Ошибка на стороне сервера', error: e.message });
    }
  }
};

module.exports.deleteCardById = async (req, res) => {
  try {
    const cardDelete = await Card.findByIdAndDelete(req.params.id);
    if (!cardDelete) {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }
    return res.send({ message: 'Карточка успешно удалена' });
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

module.exports.likeCard = async (req, res) => {
  try {
    const cardLike = await Card.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!cardLike) {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }
    return res.send({ message: 'Лайк успешно добавлен' });
  } catch (e) {
    switch (e.name) {
      case 'NotFoundError':
        return res.status(e.statusCode).send({ message: e.message });
      default:
        return res.status(500).send({ message: 'Ошибка на стороне сервера', error: e.message });
    }
  }
};

module.exports.dislikeCard = async (req, res) => {
  try {
    const cardDislike = await Card.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!cardDislike) {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }
    return res.send({ message: 'Лайк успешно удалён' });
  } catch (e) {
    switch (e.name) {
      case 'NotFoundError':
        return res.status(e.statusCode).send({ message: e.message });
      default:
        return res.status(500).send({ message: 'Ошибка на стороне сервера', error: e.message });
    }
  }
};

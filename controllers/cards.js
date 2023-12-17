const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
} = require('http2').constants;
const mongoose = require('mongoose');
const Card = require('../models/card');
const { NotFoundError } = require('../utils/errors/not-found-error');
const { CastError } = require('../utils/errors/cast-error');
const { ForbiddenError } = require('../utils/errors/forbidden-error');

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.status(HTTP_STATUS_OK).send(cards);
  } catch (e) {
    next(e);
  }
};

module.exports.createCard = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner });
    res.status(HTTP_STATUS_CREATED).send(card);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      next(new CastError({ message: e.message }));
    } else {
      next(e);
    }
  }
};

module.exports.deleteCardById = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      throw new NotFoundError({ message: 'Карточка не найдена' });
    } else if (card.owner.toString() !== req.user._id) {
      throw new ForbiddenError({ message: 'Нельзя удалить карточку другого пользователя' });
    } else {
      await Card.deleteOne(card);
      res.send({ message: 'Карточка успешно удалена' });
    }
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      next(new CastError({ message: e.message }));
    } else {
      next(e);
    }
  }
};

module.exports.likeCard = async (req, res, next) => {
  try {
    const cardLike = await Card.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!cardLike) {
      throw new NotFoundError({ message: 'Карточка не найдена' });
    } else {
      res.send({ message: 'Лайк успешно добавлен' });
    }
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      next(new CastError({ message: e.message }));
    } else {
      next(e);
    }
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  try {
    const cardDislike = await Card.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!cardDislike) {
      throw new NotFoundError({ message: 'Карточка не найдена' });
    } else {
      res.send({ message: 'Лайк успешно удалён' });
    }
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      next(new CastError({ message: e.message }));
    } else {
      next(e);
    }
  }
};

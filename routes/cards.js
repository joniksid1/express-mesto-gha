const cardRouter = require('express').Router();
const {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/', getCards);
cardRouter.post('/', createCard);
cardRouter.delete('/:id', deleteCardById);
cardRouter.put('/:id/likes', likeCard);
cardRouter.delete('/:id/likes', dislikeCard);

module.exports = { cardRouter };

const cardRouter = require('express').Router();
const {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');
const { cardIdValidation, cardDataValidation } = require('../middlewares/card-validation');

cardRouter.get('/', getCards);
cardRouter.post('/', cardDataValidation, createCard);
cardRouter.delete('/:id', cardIdValidation, deleteCardById);
cardRouter.put('/:id/likes', cardIdValidation, likeCard);
cardRouter.delete('/:id/likes', cardIdValidation, dislikeCard);

module.exports = { cardRouter };

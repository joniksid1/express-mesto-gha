const { Joi, celebrate } = require('celebrate');

const cardIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().alphanum().length(24),
  }),
});

const cardDataValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
});

module.exports = {
  cardIdValidation,
  cardDataValidation,
};

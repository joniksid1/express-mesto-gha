const { Joi, celebrate } = require('celebrate');
const { linkRegExp } = require('../constants/constants');
const { idSchema } = require('./user-validation');

const cardIdValidation = celebrate({
  params: Joi.object().keys({
    id: idSchema,
  }),
});

const cardDataValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().pattern(linkRegExp),
  }),
});

module.exports = {
  cardIdValidation,
  cardDataValidation,
};

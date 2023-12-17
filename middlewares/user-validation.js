const { Joi, celebrate } = require('celebrate');
const { linkRegExp } = require('../constants/constants');

const idSchema = Joi.string().required().alphanum().length(24);

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const registerValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(linkRegExp),
  }),
});

const userIdValidation = celebrate({
  params: Joi.object().keys({
    id: idSchema,
  }),
});

const userDataValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(linkRegExp),
  }),
});

const userAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(linkRegExp),
  }),
});

module.exports = {
  loginValidation,
  registerValidation,
  userIdValidation,
  userDataValidation,
  userAvatarValidation,
  idSchema,
};

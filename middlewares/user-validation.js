const { Joi, celebrate } = require('celebrate');

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
    avatar: Joi.string().alphanum(),
  }),
});

const userIdValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().alphanum().length(24),
  }),
});

const userDataValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
  }),
});

const userAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().alphanum(),
  }),
});

module.exports = {
  loginValidation,
  registerValidation,
  userIdValidation,
  userDataValidation,
  userAvatarValidation,
};

const mongoose = require('mongoose');
const { linkRegExp } = require('../constants/constants');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: {
      value: true,
      message: 'Поле name является обязательным',
    },
    minlength: [2, 'Минимальная длина 2 символа'],
    maxlength: [30, 'Максимальная длина 30 символов'],
  },
  link: {
    type: String,
    required: {
      value: true,
      message: 'Поле link является обязательным',
    },
    validate: {
      validator(v) {
        return linkRegExp.test(v);
      },
      message: (props) => `${props.value} не является ссылкой!`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);

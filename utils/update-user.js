const NotFoundError = require('./not-found-error');
const User = require('../models/user');

module.exports.updateUser = async (userId, updateFields) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    updateFields,
    { new: true, runValidators: true },
  );

  if (!updatedUser) {
    throw new NotFoundError({ message: 'Пользователь не найден' });
  }

  return updatedUser;
};

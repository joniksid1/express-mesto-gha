const userRouter = require('express').Router();
const {
  getUsers, getUserById, updateUserData, updateUserAvatar, getCurrentUser,
} = require('../controllers/users');
const { userIdValidation, userDataValidation } = require('../middlewares/user-validation');

userRouter.get('/', getUsers);
userRouter.get('/me', getCurrentUser);
userRouter.get('/:id', userIdValidation, getUserById);
userRouter.patch('/me', userDataValidation, updateUserData);
userRouter.patch('/me/avatar', updateUserAvatar);

module.exports = { userRouter };

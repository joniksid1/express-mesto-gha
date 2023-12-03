const userRouter = require('express').Router();
const { getUsers, getUserById, createUser } = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/:id', getUserById);
userRouter.post('/', createUser);

module.exports = { userRouter };

const Router = require('express').Router();
const userController = require('../controllers/user.controller');
const authController = require('./../controllers/auth.controller');

Router.post('/login', authController.login);
Router.post('/signup', authController.signUp);
Router.post('/forgetPassword', authController.forgotPassword);
Router.patch('/resetPassword', authController.resetPassword);

Router.route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

Router.route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = Router;

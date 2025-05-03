const Router = require('express').Router();
const orderController = require('../controllers/order.controller');
Router.route('/')
  .get(orderController.getAllOrders)
  .post(orderController.createOrder);

Router.route('/:id')
  .get(orderController.getOrder)
  .patch(orderController.sendMail, orderController.updateOrder)
  .delete(orderController.deleteOrder);

module.exports = Router;

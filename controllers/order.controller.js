const Order = require('../models/order.model');
const handlerFactory = require('./handlerFactory');

exports.createOrder = handlerFactory.createOne(Order);
exports.getOrder = handlerFactory.getOne(Order);
exports.getAllOrders = handlerFactory.getAll(Order);
exports.updateOrder = handlerFactory.updateOne(Order);
exports.deleteOrder = handlerFactory.deleteOne(Order);

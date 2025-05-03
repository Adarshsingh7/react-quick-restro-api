const Order = require('../models/order.model');
const handlerFactory = require('./handlerFactory');
const sendEmail = require('../controllers/email.controller');

exports.sendMail = async (req, res, next) => {
  // console.log(req.body);
  if (req.body.update) {
    await sendEmail(req.body.recipientEmail, 'paymentConfirmation', {
      name: req.body.recipientName,
      orderId: req.body._id,
      amount: req.body.totalAmount,
      paymentStatus: req.body.paymentStatus,
    });
  } else {
    await sendEmail(req.body.recipientEmail, 'orderStatus', {
      name: req.body.recipientName,
      orderData: req.body,
      status: req.body.status,
    });
  }
  next();
};

exports.createOrder = handlerFactory.createOne(Order);
exports.getOrder = handlerFactory.getOne(Order);
exports.getAllOrders = handlerFactory.getAll(Order);
exports.updateOrder = handlerFactory.updateOne(Order);
exports.deleteOrder = handlerFactory.deleteOne(Order);

const Order = require('../models/order.model');
const handlerFactory = require('./handlerFactory');
const sendEmail = require('./email.controller');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const process = require('process');

exports.sendMail = async (req, res, next) => {
  if (req.body.update && req.body.recipientEmail) {
    sendEmail(req.body.recipientEmail, 'paymentConfirmation', {
      name: req.body.recipientName,
      orderId: req.body._id,
      amount: req.body.totalAmount,
      paymentStatus: req.body.paymentStatus,
    });
  } else if (!req.body.update && req.body.recipientEmail) {
    sendEmail(req.body.recipientEmail, 'orderStatus', {
      name: req.body.recipientName,
      orderData: req.body,
      status: req.body.status,
    });
  }
  next();
};

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createRazorpayOrder = catchAsync(async (req, res, next) => {
  const { totalAmount } = req.body;

  if (!totalAmount) {
    return res
      .status(400)
      .json({ success: false, message: 'Amount is required' });
  }

  const order = await razorpay.orders.create({
    amount: Math.round(totalAmount * 100), // paise
    currency: 'INR',
    receipt: `receipt_order_${Date.now()}`,
  });

  // Attach to request object
  req.razorpayOrder = order;

  next();
});

exports.verifyOrder = catchAsync((req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    next();
  }

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  if (expectedSignature === razorpay_signature) {
    next();
  } else {
    return new AppError('Invalid signature, payment verification failed', 400);
  }
});

exports.createOrder = handlerFactory.createOne(Order);
exports.getOrder = handlerFactory.getOne(Order);
exports.getAllOrders = handlerFactory.getAll(Order);
exports.updateOrder = handlerFactory.updateOne(Order);
exports.deleteOrder = handlerFactory.deleteOne(Order);

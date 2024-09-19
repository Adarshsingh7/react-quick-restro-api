/** @format */
const nodemailer = require('nodemailer');
const process = require('process');
const dotenv = require('dotenv');
const { forgotPasswordTemplate } = require('../utils/emailTemplate');
dotenv.config({ path: './../config.env' });

const config = {
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
};

// 1) CREATE A TRANSPORTER
const transporter = nodemailer.createTransport(config);

async function main(to, content) {
  // 2) Define an email options
  const mailOptions = {
    from: '"Adarsh | react-quick-restro" <waveinstitute025@gmial.com>', // sender address
    to, // list of receivers
    subject: 'You got a mail from the adarsh', // Subject line
    // text: content,
    html: forgotPasswordTemplate(content),
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log('email sent successfully');
    return { status: 'success', message: 'email sent successfully' };
  } catch (err) {
    console.log('failed to send the email', err);
    return { status: 'failed', message: 'failed to send the email' };
  }
}

module.exports = main;

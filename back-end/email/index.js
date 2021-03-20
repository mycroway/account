const nodemailer = require('nodemailer');
require('dotenv').config()

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

module.exports = {
  transporter: transporter,
  nodemailer: nodemailer
};
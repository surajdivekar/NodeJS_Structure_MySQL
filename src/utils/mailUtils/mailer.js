const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send mail function
const sendMail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // sender address
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return reject(error);
      }
      console.log("Mail sent info:", info);
      resolve(info);
    });
  });
};

module.exports = {
  sendMail,
};

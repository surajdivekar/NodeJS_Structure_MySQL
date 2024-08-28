// utils/token.js

const crypto = require("crypto");

//token genrate for password
const generateResetToken = () => {
  return crypto.randomBytes(20).toString("hex");
};

//otp genration
const generateOtp = () => {
  // return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
  const otp = crypto.randomInt(100000, 1000000).toString(); // Generates a 6-digit OTP
  return otp;
};

module.exports = {
  generateResetToken,
  generateOtp,
};

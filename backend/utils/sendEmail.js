const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // My personal email aderess for testing
    auth: {
      user: process.env.EMAIL_USER,  // This is my personal email address
      pass: process.env.EMAIL_PASS   // My app password
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

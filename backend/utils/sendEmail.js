const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Or use 'Outlook', 'Yahoo', or a custom SMTP
    auth: {
      user: process.env.EMAIL_USER,  // your email
      pass: process.env.EMAIL_PASS   // app password or real password
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

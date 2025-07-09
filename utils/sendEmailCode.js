const nodemailer = require('nodemailer');
require('dotenv').config(); // <-- IMPORTANTE!

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,      // <- seu Gmail
    pass: process.env.EMAIL_PASS       // <- senha de app
  }
});

const sendEmailCode = async (to, code) => {
  const mailOptions = {
    from: `"Padaria PaniDigrano" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Seu código de confirmação',
    text: `Seu código de confirmação é: ${code}`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmailCode;

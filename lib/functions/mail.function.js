const nodemailer = require('nodemailer');

const send_mail = async (options) => {
  const { email, subject, message } = options;

  if (!email || !subject || !message)
    return new _Error('Please provide email, subject and message', 400);

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'Haspr.in <contact@haspr.in>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = send_mail;

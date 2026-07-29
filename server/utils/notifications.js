const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"TechUGrow" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log('✅ Email sent to:', to);
  } catch (error) {
    console.error('❌ Email error:', error.message);
  }
};

const getWhatsAppUrl = (phone, message) => {
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedMsg}`;
};

module.exports = { sendEmail, getWhatsAppUrl };

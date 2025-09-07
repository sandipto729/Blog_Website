const nodemailer = require('nodemailer');
const password = process.env.PassKey;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sandipto729@gmail.com',
    pass: password,
  },
});

const sendEmail = async (to, subject, content, attachments = []) => {
  const isHTML = content.includes('<') && content.includes('>');
  
  const mailOptions = {
    from: 'sandipto729@gmail.com',
    to: to,
    subject: subject,
    ...(isHTML ? { html: content } : { text: content }),
    attachments: attachments, 
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
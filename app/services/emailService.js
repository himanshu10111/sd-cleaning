const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', 
  port: 587,               
  secure: false,            
  auth: {
    user: 'sdwtcs1@gmail.com', 
    pass: 'vbzlddjxygvnhcvq'           
  }
});

function sendEmail({ to, subject, text, html }) {
    return new Promise((resolve, reject) => {
      const mailOptions = {
        from: 'your-email@example.com',
        to,
        subject,
        text,
        html
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    });
  }
  
  module.exports = sendEmail;



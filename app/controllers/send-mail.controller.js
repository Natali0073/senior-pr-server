const nodemailer = require("nodemailer");
const path = require('path');
const handlebars = require('handlebars');
const fs = require('fs');
const { authJwt } = require("../middleware");

const sendEmail = async (mailObj) => {
  const { userEmail, subject = 'Recover your credentials!', user } = mailObj;

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      service: "Gmail",
      port: 465,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
      },
    });
    const filePath = path.join(__dirname, "../template/mail.html");
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    const resetToken = authJwt.generateResetPasswordToken(user.id, user.personalKey);
    const replacements = {
      userName: user.firstName,
      userEmail: userEmail,
      expiresIn: resetToken.expiresIn,
      redirectionLink: `http://localhost:4200/#/reset-password/${resetToken.token}`,
    };
    const htmlToSend = template(replacements);

    // send mail with defined transport object
    let info = await transporter.sendMail({
      to: process.env.DB_ENV === 'development' ? process.env.ADMIN_EMAIL : userEmail,
      subject: subject,
      html: htmlToSend,
    });

    return `Message sent: ${info.messageId}`;
  } catch (error) {
    throw new Error(
      `Something went wrong in the sendmail method. Error: ${error.message}`
    );
  }
};

module.exports = sendEmail;
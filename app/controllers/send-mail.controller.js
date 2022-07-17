const nodemailer = require("nodemailer");
const path = require('path');
const handlebars = require('handlebars');
const fs = require('fs');

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
    const replacements = {
      userName: user.firstName,
      userEmail: userEmail,
      redirectionLink: `http://localhost:4200/#/reset-password/${userEmail}`,
    };
    const htmlToSend = template(replacements);

    // send mail with defined transport object
    let info = await transporter.sendMail({
      // TODO update before release
      // to: userEmail,
      to: process.env.DEFAULT_EMAIL,
      subject: subject,
      html: htmlToSend,
    });

    console.log(`Message sent: ${info.messageId}`);
    return `Message sent: ${info.messageId}`;
  } catch (error) {
    console.error(error);
    throw new Error(
      `Something went wrong in the sendmail method. Error: ${error.message}`
    );
  }
};

module.exports = sendEmail;
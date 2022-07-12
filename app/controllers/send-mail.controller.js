const nodemailer = require("nodemailer");
const path = require('path');

const sendEmail = async (mailObj) => {
  const { userEmail, subject = 'Recover your credentials!' } = mailObj;

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

    // send mail with defined transport object
    let info = await transporter.sendMail({
      // TODO update before release
      // to: userEmail,
      to: process.env.DEFAULT_EMAIL,
      subject: subject,
      html: {
        path: path.resolve(__dirname, "../template/mail.html"),
      },
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
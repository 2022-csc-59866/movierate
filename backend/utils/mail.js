//Import nodemailer.
const nodemailer = require("nodemailer");
// Import brevo.
const SibApiV3Sdk = require("sib-api-v3-sdk");

// Create an OTP with six random digits.
exports.generateOTP = (otp_length = 6) => {
  let OTP = "";
  for (let i = 1; i <= otp_length; i++) {
    const randomVal = Math.round(Math.random() * 9);
    OTP += randomVal;
  }

  return OTP;
};

// Send the generated OTP to the User.
exports.generateMailTransporter = () =>
  nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAIL_TRAP_USER,
      pass: process.env.MAIL_TRAP_PASS,
    },
  });

exports.sendEmail = async (email, name, subject, htmlContent) => {
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications["api-key"];

  apiKey.apiKey = process.env.BREVO_API_KEY;

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = htmlContent;
  sendSmtpEmail.sender = {
    name: "Movie Rate",
    email: process.env.OFFICIAL_EMAIL,
  };
  sendSmtpEmail.to = [{ email, name }];

  return await apiInstance.sendTransacEmail(sendSmtpEmail);
};

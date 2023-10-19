const nodemailer = require("nodemailer");

const { AUTH_EMAIL, AUTH_PASS } = process.env;

const config = {
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: AUTH_EMAIL,
    pass: AUTH_PASS,
  },
};

module.exports = {
  create: () => nodemailer.createTransport(config),

  send: async (mailOptions) => {
    try {
      const transporter = nodemailer.createTransport(config);
      const info = await transporter.sendMail(mailOptions);
      return info.response;
    } catch (err) {
      console.log(err);
      throw new Error(`${err.message}`);
    }
  },
};

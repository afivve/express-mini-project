const { User, Otp } = require("../../../database/models");
const { nanoid } = require("nanoid");
// const { registerValidator } = require("../../../validation/auth.validation.js");
const { error, success } = require("../../../utils/response.js");
const { hashData } = require("../../../utils/hash.data.js");
const { createTransporter, sendMail } = require("../../../utils/send.email.js");
const { generateOTP } = require("../../../utils/generate.otp.js");

const { AUTH_EMAIL } = process.env;

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existing_user = await User.findOne({ where: { email } });
    if (existing_user) {
      return res.status(409).json(error("Email sudah terdaftar"));
    }

    const uuid = nanoid();
    const hashed_password = await hashData(password);

    await User.create({
      uuid: uuid,
      email: email,
      password: hashed_password,
    });

    // await sendVerificationEmail(email);

    res.status(201).json(success("Cek Email Untuk Verifikasi OTP", { email }));
  } catch (err) {
    console.error(err);
    return res.status(500).json(error("Kesalahan Server"));
  }
};

/* const sendVerificationEmail = async (email) => {
  try {
    const transporter = createTransporter();
    await transporter.verify();

    const existing_email_OTP = await Otp.findOne({ where: { email } });

    if (existing_email_OTP) {
      await Otp.destroy({ where: { email } });
    }

    const generated_OTP = await generateOTP();

    const mailOptions = {
      from: AUTH_EMAIL,
      to: email,
      subject: "Verifikasi OTP",
      html: `<p>Verifikasi OTP</p>
        <p style="color: tomato; font-size:25px; letter-spacing: 2px;"><b>${generated_OTP}</b></p>
        <p>This code <b>expires in 1 hour(s)</b>.</p>`,
    };

    await sendMail(mailOptions);

    const hashed_OTP = await hashData(generated_OTP);
    const created_at = new Date();
    const expires_at = new Date(Date.now() + 3600000);

    await Otp.create({
      email: email,
      otp: hashed_OTP,
      createdAt: created_at,
      expiresAt: expires_at,
    });
  } catch (err) {
    console.error(err);
    throw new Error("Kesalahan Server. Gagal Membuat OTP");
  }
};
 */
module.exports = {
  register,
};

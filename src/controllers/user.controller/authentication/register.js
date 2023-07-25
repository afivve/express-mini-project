const { User, Otp } = require("../../../database/models");

const { nanoid } = require("nanoid");
const { validationResult } = require("express-validator");
const { registerValidator } = require("../../../validation/auth.validation.js");
const { error, success } = require("../../../utils/response.js");
const { hashData } = require("../../../utils/hash.data.js");
/* const { createTransporter, sendMail } = require("../../../utils/send.email.js");
const { generateOTP } = require("../../../utils/generate.otp.js"); */

const { AUTH_EMAIL } = process.env;

const register = async (req, res) => {
  const { email, password, confPassword } = req.body;

  await Promise.all(registerValidator.map((validator) => validator.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json(error(errorMessages.join(", ")));
  }

  try {
    const existing_user = await User.findOne({ where: { email } });

    if (existing_user)
      return res.status(409).json(error("Email sudah terdaftar"));

    const hash_password = await hashData(password);
    const user_id = nanoid();

    /*  try {
      const transporter = createTransporter();
      await transporter.verify();
    } catch (err) {
      console.log("Error verifikasi transporter:", err);
      return res
        .status(500)
        .json(error("Kesalahan Internal Server. Gagal Mengirim OTP"));
    } */

    await User.create({
      id: user_id,
      email: email,
      password: hash_password,
    });

    /* Create OTP */
    /* try {
      const existing_email_otp = await Otp.findOne({
        where: {
          email: email,
        },
      });

      if (existing_email_otp) {
        await Otp.destroy({
          where: {
            email: email,
          },
        });
      }

      const generated_otp = await generateOTP();

      const mailOptions = {
        from: AUTH_EMAIL,
        to: email,
        subject: "Verifikasi OTP",
        html: `<p>Verifikasi OTP</p>
        <p style="color: tomato; font-size:25px; letter-spacing: 2px;"><b>${generated_otp}</b></p>
        <p>This code <b>expires in 1 hour(s)</b>.</p>`,
      };

      await sendMail(mailOptions);

      const hashed_otp = await hashData(generated_otp);
      const created_at = new Date();
      const expires_at = new Date(Date.now() + 3600000);

      await Otp.create({
        email: email,
        otp: hashed_otp,
        createdAt: created_at,
        expiresAt: expires_at,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json(error("Kesalahan Server. Gagal Membuat OTP"));
    } */

    res.status(201).json(success("Cek Email Untuk Verifikasi OTP", { email }));
  } catch (err) {
    console.log(err);
    return res.status(500).json(error("Kesalahan Server"));
  }
};

module.exports = {
  register,
};

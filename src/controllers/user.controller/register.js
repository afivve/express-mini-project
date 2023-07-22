const User = require("../../models/user.model.js");
const Otp = require("../../models/otp.model.js");
const nanoid = require("nanoid");
const { validationResult } = require("express-validator");
const { registerValidator } = require("../../validation/auth.validation.js");
const { error, success } = require("../../utils/response.js");
const { hashData } = require("../../utils/hash.data.js");
const { createTransporter, sendMail } = require("../../utils/send.email.js");
const { generateOTP } = require("../../utils/generate.otp.js");

const { AUTH_EMAIL } = process.env;

const register = async (req, res) => {
  const { name, email, password, confPassword } = req.body;

  await Promise.all(registerValidator.map((validator) => validator.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json(error(errorMessages.join(", ")));
  }

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser)
      return res.status(409).json(error("Email sudah terdaftar"));

    const hashPassword = await hashData(password);
    const userId = nanoid();

    try {
      const transporter = createTransporter();
      await transporter.verify();
    } catch (err) {
      console.log("Error verifikasi transporter:", err);
      return res
        .status(500)
        .json(error("Kesalahan Internal Server. Gagal Mengirim OTP"));
    }

    await User.create({
      id: userId,
      name: name,
      email: email,
      password: hashPassword,
    });

    /* Create OTP */
    try {
      const existingOTPEmail = await Otp.findOne({
        where: {
          email: email,
        },
      });

      if (existingOTPEmail) {
        await Otp.destroy({
          where: {
            email: email,
          },
        });
      }

      const generatedOTP = await generateOTP();

      const mailOptions = {
        from: AUTH_EMAIL,
        to: email,
        subject: "Verifikasi OTP",
        html: `<p>Verifikasi OTP</p>
        <p style="color: tomato; font-size:25px; letter-spacing: 2px;"><b>${generatedOTP}</b></p>
        <p>This code <b>expires in 1 hour(s)</b>.</p>`,
      };

      await sendMail(mailOptions);

      const hashedOTP = await hashData(generatedOTP);
      const createdAt = new Date();
      const expiresAt = new Date(Date.now() + 3600000);

      await Otp.create({
        email: email,
        otp: hashedOTP,
        createdAt: createdAt,
        expiresAt: expiresAt,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json(error("Kesalahan Server. Gagal Membuat OTP"));
    }

    res
      .status(201)
      .json(success("Cek Email Untuk Verifikasi OTP", { name, email }));
  } catch (err) {
    console.log(err);
    return res.status(500).json(error("Kesalahan Server"));
  }
};

module.exports = {
  register,
};

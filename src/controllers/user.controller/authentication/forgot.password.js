const { User, Otp } = require("../../../database/models");
const { error, success } = require("../../../utils/response.js");
const { createTransporter, sendMail } = require("../../../utils/send.email.js");
const { generateOTP } = require("../../../utils/generate.otp.js");
const { hashData, verifyHashedData } = require("../../../utils/hash.data.js");
// const {
//   newPasswordValidator,
//   sendOtpNewPasswordValidator,
// } = require("../../../validation/auth.validation.js");
const { validationResult } = require("express-validator");

const { AUTH_EMAIL } = process.env;

const sendOtpNewPassword = async (req, res) => {
  const { email } = req.body;

  // await Promise.all(
  //   sendOtpNewPasswordValidator.map((validator) => validator.run(req))
  // );
  // const errors = validationResult(req);

  // if (!errors.isEmpty()) {
  //   const errorMessages = errors.array().map((error) => error.msg);
  //   return res.status(400).json(error(errorMessages.join(", ")));
  // }

  try {
    const existingUser = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!existingUser)
      return res.status(404).json(error("User tidak ditemukan"));

    const transporter = createTransporter();
    await transporter.verify();

    const existingEmailOTP = await Otp.findOne({
      where: {
        email: email,
      },
    });

    if (existingEmailOTP) {
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
      subject: "Password Reset",
      html: `<p>Password Reset</p>
        <p style="color: tomato; font-size:25px; letter-spacing: 2px;"><b>${generatedOTP}</b></p>
        <p>This code <b>expires in 1 hour(s)</b>.</p>`,
    };

    const hashedOTP = await hashData(generatedOTP);
    const createdAt = new Date();
    const expiresAt = new Date(Date.now() + 3600000);

    await Otp.create({
      email: email,
      otp: hashedOTP,
      createdAt: createdAt,
      expiresAt: expiresAt,
    });

    await sendMail(mailOptions);

    return res.status(201).json(success("OTP telah dikirim, Cek email masuk"));
  } catch (err) {
    console.error(err);
    return res.status(500).json(error("Kesalahan Internal Server"));
  }
};

const newPassword = async (req, res) => {
  const { email, otp, password } = req.body;

  await Promise.all(
    newPasswordValidator.map((validator) => validator.run(req))
  );
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json(error(errorMessages.join(", ")));
  }

  try {
    const matchedOTPRecord = await Otp.findOne({
      where: {
        email: email,
      },
    });

    if (!matchedOTPRecord) res.status(404).json(error("OTP Tidak Ditemukan"));

    const { expiresAt } = matchedOTPRecord;

    if (expiresAt < Date.now()) {
      await Otp.destroy({
        where: {
          email: email,
        },
      });
      res.status(500).json(error("OTP Telah Kadaluwarsa"));
    }

    const hashedOTP = matchedOTPRecord.otp;
    const hashPassword = await hashData(password);
    const verifyOTP = await verifyHashedData(otp, hashedOTP);

    if (verifyOTP) {
      await User.update(
        { password: hashPassword },
        {
          where: {
            email: email,
          },
        }
      );
      await Otp.destroy({
        where: {
          email: email,
        },
      });
      return res
        .status(201)
        .json(success("Password Berhasil Diganti", verifyOTP));
    }
    return res.status(500).json(error("OTP Tidak Valid"));
  } catch (err) {
    console.error(err);
    return res.status(500).json(error("Kesalahan Internal Server"));
  }
};

module.exports = {
  sendOtpNewPassword,
  newPassword,
};

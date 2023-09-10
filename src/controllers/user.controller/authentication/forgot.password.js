const { User, Otp } = require("../../../database/models");
const { error, success } = require("../../../utils/response.js");
const { createTransporter, sendMail } = require("../../../utils/send.email.js");
const { generateOTP } = require("../../../utils/generate.otp.js");
const { hashData, verifyHashedData } = require("../../../utils/hash.data.js");
const {
  newPasswordValidator,
  sendOtpNewPasswordValidator,
} = require("../../../validation/auth.validation.js");
const { validationResult } = require("express-validator");

const { AUTH_EMAIL } = process.env;

const sendOtpNewPassword = async (req, res) => {
  const { email } = req.body;
  await Promise.all(
    sendOtpNewPasswordValidator.map((validator) => validator.run(req))
  );
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json(error(errorMessages.join(", ")));
  }

  try {
    const existing_user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!existing_user)
      return res.status(404).json(error("User tidak ditemukan"));

    if (!existing_user.verified)
      return res.status(403).json(error("User belum diverifikasi"));

    try {
      const transporter = createTransporter();
      await transporter.verify();
    } catch (err) {
      console.log("Error verifikasi transporter:", err);
      return res
        .status(500)
        .json(error("Kesalahan Internal Server. Gagal Mengirim OTP"));
    }

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

    const mail_options = {
      from: AUTH_EMAIL,
      to: email,
      subject: "Password Reset",
      html: `<p>Password Reset</p>
        <p style="color: tomato; font-size:25px; letter-spacing: 2px;"><b>${generated_otp}</b></p>
        <p>This code <b>expires in 1 hour(s)</b>.</p>`,
    };

    try {
      const hashed_otp = await hashData(generated_otp);
      const created_at = new Date();
      const expires_at = new Date(Date.now() + 3600000);

      await Otp.create({
        email: email,
        otp: hashed_otp,
        createdAt: created_at,
        expiresAt: expires_at,
      });

      await sendMail(mail_options);

      return res
        .status(201)
        .json(success("OTP telah dikirim, Cek email masuk"));
    } catch (err) {
      console.log(err);
      return res.status(500).json(error("Kesalahan Internal Server"));
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(error("Kesalahan Internal Server"));
  }
};

const newPassword = async (req, res) => {
  const { email, otp, password, confPassword } = req.body;
  await Promise.all(
    newPasswordValidator.map((validator) => validator.run(req))
  );
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json(error(errorMessages.join(", ")));
  }

  try {
    const matched_otp_record = await Otp.findOne({
      where: {
        email: email,
      },
    });

    if (!matched_otp_record) res.status(404).json(error("OTP Tidak Ditemukan"));

    const { expiresAt } = matched_otp_record;

    if (expiresAt < Date.now()) {
      await Otp.destroy({
        where: {
          email: email,
        },
      });
      res.status(500).json(error("OTP Telah Kadaluwarsa"));
    }

    const hashed_otp = matched_otp_record.otp;
    const hash_password = await hashData(password);
    const verify_otp = await verifyHashedData(otp, hashed_otp);

    if (verify_otp) {
      await User.update(
        { password: hash_password },
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
        .json(success("Password Berhasil Diganti", verify_otp));
    }
    return res.status(500).json(error("OTP Tidak Valid"));
  } catch (err) {
    console.log(err);
    return res.status(500).json(error("Kesalahan Internal Server"));
  }
};

module.exports = {
  sendOtpNewPassword,
  newPassword,
};

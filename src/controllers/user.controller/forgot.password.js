import User from "../../models/user.model.js";
import Otp from "../../models/otp.model.js";
import { error, success } from "../../utils/response.js";
import { createTransporter, sendMail } from "../../utils/send.email.js";
import { generateOTP } from "../../utils/generate.otp.js";
import { hashData, verifyHashedData } from "../../utils/hash.data.js";

const { AUTH_EMAIL } = process.env;

export const sendOtpNewPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!existingUser)
      return res.status(404).json(error("User tidak ditemukan"));

    if (!existingUser.verified)
      return res.status(400).json(error("User belum diverifikasi"));

    try {
      const transporter = createTransporter();
      await transporter.verify();
    } catch (err) {
      console.log("Error verifikasi transporter:", err);
      return res
        .status(500)
        .json(error("Kesalahan Internal Server. Gagal Mengirim OTP"));
    }

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
      subject: "Password Reset",
      html: `<p>Password Reset</p>
        <p style="color: tomato; font-size:25px; letter-spacing: 2px;"><b>${generatedOTP}</b></p>
        <p>This code <b>expires in 1 hour(s)</b>.</p>`,
    };

    try {
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

      return res
        .status(200)
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

export const newPassword = async (req, res) => {
  const { email, otp, password, confPassword } = req.body;

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
      res.status(400).json(error("OTP Telah Kadaluwarsa"));
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
        .status(200)
        .json(success("Password Berhasil Diganti", verifyOTP));
    }
    return res.status(500).json(error("OTP Tidak Valid"));
  } catch (err) {
    console.log(err);
    return res.status(500).json(error("Kesalahan Internal Server"));
  }
};

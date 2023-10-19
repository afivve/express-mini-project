const { Otp } = require("../database/models");
const hashData = require("../utils/hash.data.js");
const { generateOTP } = require("../utils/generate.otp.js");
const transporter = require("../utils/transporter.utils");

const { AUTH_EMAIL } = process.env;

const sendVerificationEmail = async (email) => {
  try {
    const create_transporter = transporter.create();
    await create_transporter.verify();

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

    await transporter.send(mailOptions);

    const hashed_OTP = await hashData.create(generated_OTP);
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

module.exports = sendVerificationEmail;

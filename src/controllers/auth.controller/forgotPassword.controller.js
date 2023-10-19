const { User, Otp } = require("../../database/models");
const hashData = require("../../utils/hash.data");
const apiResponse = require("../../utils/response.js");

const newPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const matchedOTPRecord = await Otp.findOne({
      where: {
        email: email,
      },
    });

    if (!matchedOTPRecord)
      res.status(404).json(apiResponse.error("OTP Tidak Ditemukan"));

    const { expiresAt } = matchedOTPRecord;

    if (expiresAt < Date.now()) {
      await Otp.destroy({
        where: {
          email: email,
        },
      });
      res.status(500).json(apiResponse.error("OTP Telah Kadaluwarsa"));
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
        .json(apiResponse.success("Password Berhasil Diganti", verifyOTP));
    }
    return res.status(500).json(apiResponse.error("OTP Tidak Valid"));
  } catch (err) {
    console.error(err);
    return res.status(500).json(apiResponse.error("Kesalahan Internal Server"));
  }
};

module.exports = newPassword;

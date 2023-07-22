const User = require("../../models/user.model.js");
const Otp = require("../../models/otp.model.js");

const { verifyHashedData } = require("../../utils/hash.data.js");
const { error, success } = require("../../utils/response.js");
const { verifyUserValidator } = require("../../validation/auth.validation.js");
const { validationResult } = require("express-validator");

const verifyUser = async (req, res) => {
  const { email, otp } = req.body;
  await Promise.all(verifyUserValidator.map((validator) => validator.run(req)));
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
      res.status(400).json(error("OTP Telah Kadaluwarsa"));
    }

    const hashedOTP = matchedOTPRecord.otp;
    const verifyOTP = await verifyHashedData(otp, hashedOTP);

    if (verifyOTP) {
      await User.update(
        { verified: true },
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
      return res.status(200).json(success("Verifikasi OTP Sukses", verifyOTP));
    }
    return res.status(500).json(error("OTP Tidak Valid"));
  } catch (err) {
    console.log(err);
    return res.status(500).json(error("Kesalahan Internal Server"));
  }
};

module.exports = {
  verifyUser,
};

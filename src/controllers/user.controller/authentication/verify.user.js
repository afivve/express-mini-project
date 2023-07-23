const { User, Otp } = require("../../../database/models");

const { verifyHashedData } = require("../../../utils/hash.data.js");
const { error, success } = require("../../../utils/response.js");
const {
  verifyUserValidator,
} = require("../../../validation/auth.validation.js");
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
      res.status(400).json(error("OTP Telah Kadaluwarsa"));
    }

    const hashed_data = matched_otp_record.otp;
    const verify_otp = await verifyHashedData(otp, hashed_data);

    if (verify_otp) {
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
      return res.status(200).json(success("Verifikasi OTP Sukses", verify_otp));
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

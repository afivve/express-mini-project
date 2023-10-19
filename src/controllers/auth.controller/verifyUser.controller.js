const { User, Otp } = require("../../database/models");
const hashData = require("../../utils/hash.data");
const apiResponse = require("../../utils/response.js");

const verifyUser = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const matched_otp_record = await Otp.findOne({
      where: {
        email: email,
      },
    });

    if (!matched_otp_record)
      res.status(404).json(apiResponse.error("OTP Tidak Ditemukan"));

    const { expiresAt } = matched_otp_record;

    if (expiresAt < Date.now()) {
      await Otp.destroy({
        where: {
          email: email,
        },
      });
      res.status(400).json(apiResponse.error("OTP Telah Kadaluwarsa"));
    }

    const hashed_otp = matched_otp_record.otp;
    const verify_otp = await hashData.verify(otp, hashed_otp);

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
      return res
        .status(200)
        .json(apiResponse.success("Verifikasi OTP Sukses", verify_otp));
    }
    return res.status(500).json(apiResponse.error("OTP Tidak Valid"));
  } catch (err) {
    console.log(err);
    return res.status(500).json(apiResponse.error("Kesalahan Internal Server"));
  }
};

module.exports = verifyUser;

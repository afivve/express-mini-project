import User from "../../models/user.model.js";
import Otp from "../../models/otp.model.js";

import { verifyHashedData } from "../../utils/hash.data.js";
import { error, success } from "../../utils/response.js";

export const verifyUser = async (req, res) => {
  const { email, otp } = req.body;
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

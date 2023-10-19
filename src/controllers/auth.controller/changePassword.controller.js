const { User } = require("../../database/models");
const hashData = require("../../utils/hash.data");

const apiResponse = require("../../utils/response.js");

const changePassword = async (req, res) => {
  try {
    const uuid = req.uuid;
    const { currentPassword, newPassword, confPassword } = req.body;

    if (!uuid)
      return res
        .status(401)
        .json(apiResponse.error("Silahkan Login Terlebih Dahulu"));

    const user = await User.findOne({
      where: {
        uuid: uuid,
      },
    });

    const current_password = user.password;
    const verify_current_password = await hashData.verify(
      currentPassword,
      current_password
    );

    if (!verify_current_password) {
      return res.status(400).json(apiResponse.error("Password Salah"));
    }

    const hash_password = await hashData.create(newPassword);

    await User.update(
      { password: hash_password },
      {
        where: {
          email: email,
        },
      }
    );

    return res
      .status(201)
      .json(apiResponse.success("Password berhasil diubah"));
  } catch (err) {
    console.log(err);
    return res.status(500).json(apiResponse.error("Kesalahan Server"));
  }
};

module.exports = changePassword;

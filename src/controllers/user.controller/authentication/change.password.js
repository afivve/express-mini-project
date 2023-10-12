const { verifyHashedData, hashData } = require("../../../utils/hash.data");
// const {
//   changePasswordValidator,
// } = require("../../../validation/auth.validation.js");
const { error, success } = require("../../../utils/response.js");

const model = require("../../../database/models");
const User = model.User;

const changePassword = async (req, res) => {
  const email = req.email;
  // const { currentPassword, newPassword, confPassword } = req.body;

  // await Promise.all(
  //   changePasswordValidator.map((validator) => validator.run(req))
  // );
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   const errorMessages = errors.array().map((error) => error.msg);
  //   return res.status(400).json(error(errorMessages.join(", ")));
  // }

  try {
    if (!email)
      return res.status(401).json(error("Silahkan Login Terlebih Dahulu"));

    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).json(error("Pengguna tidak ditemukan"));
    }

    const current_password = user.password;
    const verify_current_password = await verifyHashedData(
      currentPassword,
      current_password
    );

    if (!verify_current_password) {
      return res.status(400).json(error("Password Salah"));
    }

    const hash_password = await hashData(newPassword);

    await User.update(
      { password: hash_password },
      {
        where: {
          email: email,
        },
      }
    );

    return res.status(201).json(success("Password berhasil diubah"));
  } catch (err) {
    console.log(err);
    return res.status(500).json(error("Kesalahan Server"));
  }
};

module.exports = {
  changePassword,
};

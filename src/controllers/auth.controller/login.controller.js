const { User } = require("../../database/models");
const hashData = require("../../utils/hash.data");
const jwt = require("../../utils/token.utils");

const apiResponse = require("../../utils/response.js");

const login = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user)
      return res.status(404).json(apiResponse.error("Email tidak ditemukan"));

    const { id, uuid, email, verified, role } = user;

    if (verified === false)
      return res
        .status(400)
        .json(apiResponse.error("Akun belum terverifikasi"));

    const hashed_password = user.password;
    const password_match = await hashData.verify(
      req.body.password,
      hashed_password
    );
    if (!password_match)
      return res.status(403).json(apiResponse.error("Password Salah"));

    const token_data = { id, uuid, email, role };
    const token = await jwt.create(token_data);
    const refresh_token = await jwt.refresh(token_data);

    await User.update(
      { refreshToken: refresh_token },
      {
        where: {
          id: id,
        },
      }
    );

    res.cookie("refreshToken", refresh_token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(
      apiResponse.success("Login Berhasil", {
        id: id,
        uuid: uuid,
        email: email,
        token: token,
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json(apiResponse.error("Kesalahan Server"));
  }
};

module.exports = login;

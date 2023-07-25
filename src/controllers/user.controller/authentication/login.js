const { User } = require("../../../database/models");

const { error, success } = require("../../../utils/response.js");
const { verifyHashedData } = require("../../../utils/hash.data.js");
const { createToken } = require("../../../utils/create.token.js");
const { loginValidator } = require("../../../validation/auth.validation.js");
const { validationResult } = require("express-validator");
const { refreshToken } = require("../../../utils/refresh.token.js");

const login = async (req, res) => {
  await Promise.all(loginValidator.map((validator) => validator.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error_messages = errors.array().map((error) => error.msg);
    return res.status(400).json(error(error_messages.join(", ")));
  }

  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user) return res.status(404).json(error("Email tidak ditemukan"));

    const { id, email, verified, role } = user;

    if (verified === false)
      return res.status(400).json(error("Akun belum terverifikasi"));

    const hashed_password = user.password;
    const password_match = await verifyHashedData(
      req.body.password,
      hashed_password
    );
    if (!password_match) return res.status(403).json(error("Password Salah"));

    const token_data = { id, email, role };
    const token = await createToken(token_data);
    const refresh_token = await refreshToken(token_data);

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
      success("Login Berhasil", {
        id: id,
        email: email,
        token: token,
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json(error("Kesalahan Server"));
  }
};

module.exports = {
  login,
};

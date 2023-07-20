import User from "../../models/user.model.js";

import { error, success } from "../../utils/response.js";
import { verifyHashedData } from "../../utils/hash.data.js";
import { createToken } from "../../utils/create.token.js";
import { loginValidator } from "../../validation/auth.validation.js";
import { validationResult } from "express-validator";

export const login = async (req, res) => {
  const { email, password } = req.body;
  await Promise.all(loginValidator.map((validator) => validator.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json(error(errorMessages.join(", ")));
  }

  try {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) return res.status(404).json(error("Email tidak ditemukan"));

    const { verified } = user;

    if (verified === false)
      return res.status(400).json(error("Akun belum terverifikasi"));

    const hashedPassword = user.password;
    const passwordMatch = await verifyHashedData(password, hashedPassword);
    if (!passwordMatch) return res.status(403).json(error("Password Salah"));

    const tokenData = { id, name, email };
    const token = await createToken(tokenData);

    await User.update(
      { token: token },
      {
        where: {
          id: id,
        },
      }
    );

    return res.status(200).json(
      success("Login Berhasil", {
        id: id,
        name: name,
        email: email,
        token: token,
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json(error("Kesalahan Server"));
  }
};

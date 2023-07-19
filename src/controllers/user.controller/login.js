import User from "../../models/user.model.js";

import { error, success } from "../../utils/response.js";
import { verifyHashedData } from "../../utils/hash.data.js";
import { createToken } from "../../utils/create.token.js";

export const login = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user) return res.status(404).json(error("Email tidak ditemukan"));

    const { id, name, email, verified } = user;

    if (verified === false)
      return res.status(400).json(error("Akun belum terverifikasi"));

    const hashedPassword = user.password;
    const passwordMatch = await verifyHashedData(
      req.body.password,
      hashedPassword
    );
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

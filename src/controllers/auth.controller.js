const { User } = require("../database/models");

const HashData = require("../utils/hash.data.js");
const apiResponse = require("../utils/response");
const JWT = require("../utils/token.utils");

const AuthService = require("../services/auth.services");

module.exports = {
  register: async (req, res) => {
    try {
      await AuthService.register(req.body);
      return res.json(apiResponse.success("Register Successfully"));
    } catch (err) {
      console.error(err);
      return res.json(apiResponse.error("Kesalahan Server"));
    }
  },

  login: async (req, res) => {
    try {
      const user = await User.findOne({
        where: {
          email: req.body.email,
        },
      });

      if (!user) return res.json(apiResponse.error("Email tidak ditemukan"));

      const { id, uuid, email, verified, role } = user;

      if (verified === false)
        return res.json(apiResponse.error("Akun belum terverifikasi"));

      const hashed_password = user.password;
      const password_match = await HashData.verify(
        req.body.password,
        hashed_password
      );
      if (!password_match) return res.json(apiResponse.error("Password Salah"));

      const token_data = { id, uuid, email, role };
      const token = await JWT.createToken(token_data);
      const refresh_token = await JWT.refreshToken(token_data);

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

      const data = {
        uuid: uuid,
        email: email,
        token: token,
      };

      return res.json(apiResponse.success("Login Berhasil", data));
    } catch (err) {
      console.log(err);
      return res.json(apiResponse.error("Kesalahan Server"));
    }
  },
};

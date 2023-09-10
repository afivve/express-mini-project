const { User } = require("../../../database/models");
const jwt = require("jsonwebtoken");

const { error, success } = require("../../../utils/response.js");

const generateRefreshToken = async (req, res) => {
  try {
    const refresh_token = req.cookies.refreshToken;
    if (!refresh_token)
      return res.status(401).json(error("Silahkan Login Terlebih Dahulu"));
    const user = await User.findAll({
      where: {
        refreshToken: refresh_token,
      },
    });
    if (!user[0])
      return res.status(401).json(error("Silahkan Login Terlebih Dahulu"));
    jwt.verify(refresh_token, process.env.REFRESH_TOKEN, (err, decoded) => {
      if (err)
        return res.status(401).json(error("Silahkan Login Terlebih Dahulu"));
      const userId = user[0].id;
      const email = user[0].email;
      const role = user[0].role;
      const token = jwt.sign({ userId, email, role }, process.env.TOKEN_KEY, {
        expiresIn: "1d",
      });
      res
        .status(201)
        .json(
          success("Refresh Token Berhasil Dibuat", { refreshToken: token })
        );
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  generateRefreshToken,
};

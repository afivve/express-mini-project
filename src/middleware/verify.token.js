const { User } = require("../database/models");
const jwt = require("jsonwebtoken");
const { error } = require("../utils/response.js");

const verifyToken = async (req, res, next) => {
  const auth_header = req.headers["authorization"];
  const token = auth_header && auth_header.split(" ")[1];
  const refresh_token = req.cookies.refreshToken;

  if (!token || !refresh_token)
    return res
      .status(401)
      .json(error("Mohon login ke akun anda terlebih dahulu"));

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const user = await User.findOne({
      where: {
        uuid: decoded.uuid,
      },
    });

    req.email = user.email;
    req.uuid = user.uuid;
    req.role = user.role;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res
        .status(401)
        .json(error("Mohon login ke akun anda terlebih dahulu"));
    } else {
      console.log(err);
      return res.status(500).json(error("Kesalahan Internal Server"));
    }
  }
};

module.exports = {
  verifyToken,
};

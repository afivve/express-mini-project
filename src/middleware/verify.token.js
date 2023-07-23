const { User } = require("../database/models");
const jwt = require("jsonwebtoken");
const { error } = require("../utils/response.js");

const verifyToken = async (req, res, next) => {
  const auth_header = req.headers["authorization"];
  const token = auth_header && auth_header.split(" ")[1];

  if (token == null)
    return res
      .status(401)
      .json(error("Mohon login ke akun anda terlebih dahulu"));

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const user = await User.findOne({
      where: {
        email: decoded.email,
      },
    });

    req.email = user.email;
    req.role = user.role;
    next();
  } catch (err) {
    console.log(err);
    return res.status(50).json(error("Kesalahan Internal Server"));
  }
};

module.exports = {
  verifyToken,
};

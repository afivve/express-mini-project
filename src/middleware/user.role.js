const { User } = require("../database/models");

const jwt = require("jsonwebtoken");
const { error } = require("../utils/response.js");

const admin = async (req, res, next) => {
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
        uuid: decoded.uuid,
      },
    });

    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    if (user.role !== "admin")
      return res.status(403).json(error("Akses Terlarang"));
    next();
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  admin,
};

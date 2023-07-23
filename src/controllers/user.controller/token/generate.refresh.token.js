const { User } = require("../../../database/models");
const jwt = require("jsonwebtoken");

const generateRefreshToken = async (req, res) => {
  try {
    const refresh_token = req.cookies.refreshToken;
    if (!refresh_token) return res.status(401).json("error1");
    const user = await User.findAll({
      where: {
        refreshToken: refresh_token,
      },
    });
    if (!user[0]) return res.status(403).json("error2");
    jwt.verify(refresh_token, process.env.REFRESH_TOKEN, (err, decoded) => {
      if (err) return res.status(403).json("error3");
      const userId = user[0].id;
      const email = user[0].email;
      const role = user[0].role;
      const token = jwt.sign({ userId, email, role }, process.env.TOKEN_KEY, {
        expiresIn: "1d",
      });
      res.json({ token });
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  generateRefreshToken,
};

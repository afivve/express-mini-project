const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const refreshToken = async (token_data, refresh_token = REFRESH_TOKEN) => {
  try {
    const token = jwt.sign(token_data, refresh_token, {
      expiresIn: "1d",
    });
    return token;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  refreshToken,
};

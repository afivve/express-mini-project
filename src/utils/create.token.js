const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const TOKEN_KEY = process.env.TOKEN_KEY;

const createToken = async (token_data, token_key = TOKEN_KEY) => {
  try {
    const token = jwt.sign(token_data, token_key, {
      expiresIn: "60s",
    });
    return token;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createToken,
};

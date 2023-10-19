const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const TOKEN_KEY = process.env.TOKEN_KEY;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

module.exports = {
  create: async (token_data, token_key = TOKEN_KEY) => {
    try {
      const token = jwt.sign(token_data, token_key, {
        expiresIn: "100s",
      });
      return token;
    } catch (err) {
      throw err;
    }
  },
  refresh: async (token_data, refresh_token = REFRESH_TOKEN) => {
    try {
      const token = jwt.sign(token_data, refresh_token, {
        expiresIn: "1d",
      });
      return token;
    } catch (err) {
      throw err;
    }
  },
};

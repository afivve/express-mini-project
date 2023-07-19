import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const TOKEN_KEY = process.env.TOKEN_KEY;

export const createToken = async (tokenData, tokenKey = TOKEN_KEY) => {
  try {
    const token = jwt.sign(tokenData, tokenKey, {
      expiresIn: "24h",
    });
    return token;
  } catch (err) {
    throw err;
  }
};

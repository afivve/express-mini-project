import jwt from "jsonwebtoken";
import { error } from "../utils/response.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null)
    return res.status(404).json(error("Token tidak ditemukan"));

  jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
    if (err) return res.status(401).json(error("Token tidak valid"));
    req.email = decoded.email;
    next();
  });
};

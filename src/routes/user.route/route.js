const express = require("express");
const { user } = require("../../controllers/playground.js");
const {
  newPassword,
  sendOtpNewPassword,
} = require("../../controllers/user.controller/authentication/forgot.password.js");
const {
  login,
} = require("../../controllers/user.controller/authentication/login.js");
const {
  logout,
} = require("../../controllers/user.controller/authentication/logout.js");
const {
  register,
} = require("../../controllers/user.controller/authentication/register.js");
const {
  verifyUser,
} = require("../../controllers/user.controller/authentication/verify.user.js");
const { admin } = require("../../middleware/user.role.js");

const { verifyToken } = require("../../middleware/verify.token.js");
const {
  generateRefreshToken,
} = require("../../controllers/user.controller/token/generate.refresh.token.js");

const router = express.Router();

router.post("/register", register);
router.post("/verify", verifyUser);
router.post("/login", login);
router.post("/sendOtpNewPassword", sendOtpNewPassword);
router.post("/newPassword", newPassword);
router.get("/user", verifyToken, user);
router.get("/token", generateRefreshToken);

router.delete("/logout", logout);

module.exports = router;

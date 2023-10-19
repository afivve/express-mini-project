const express = require("express");
const { user } = require("../../controllers/playground.js");
const {
  newPassword,
  sendOtpNewPassword,
} = require("../../controllers/user.controller/authentication/forgot.password.js");
const {
  logout,
} = require("../../controllers/user.controller/authentication/logout.js");
const {
  verifyUser,
} = require("../../controllers/user.controller/authentication/verify.user.js");
const { verifyToken } = require("../../middleware/verify.token.js");
const {
  generateRefreshToken,
} = require("../../controllers/user.controller/token/generate.refresh.token.js");
const {
  changePassword,
} = require("../../controllers/user.controller/authentication/change.password.js");

const AuthController = require("../../controllers/auth.controller");

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/verify", verifyUser);
router.post("/send-otp-new-password", sendOtpNewPassword);
router.post("/new-password", newPassword);
router.get("/user", verifyToken, user);
router.get("/token", generateRefreshToken);

router.put("/change-password", verifyToken, changePassword);

router.delete("/logout", logout);

module.exports = router;

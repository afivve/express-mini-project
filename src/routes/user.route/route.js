const express = require("express");
const { user } = require("../../controllers/user.controller/authentication.js");
const {
  newPassword,
  sendOtpNewPassword,
} = require("../../controllers/user.controller/forgot.password.js");
const { login } = require("../../controllers/user.controller/login.js");
const { register } = require("../../controllers/user.controller/register.js");
const {
  verifyUser,
} = require("../../controllers/user.controller/verify.user.js");

/* const { verifyToken } = require("../../middleware/verify.token.js"); */

const router = express.Router();

router.post("/register", register);
router.post("/verify", verifyUser);
router.post("/login", login);
router.post("/sendOtpNewPassword", sendOtpNewPassword);
router.post("/newPassword", newPassword);
router.get("/user", user);

module.exports = router;

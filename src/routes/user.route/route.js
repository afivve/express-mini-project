import express from "express";
import { user } from "../../controllers/user.controller/authentication.js";
import {
  newPassword,
  sendOtpNewPassword,
} from "../../controllers/user.controller/forgot.password.js";
import { login } from "../../controllers/user.controller/login.js";
import { register } from "../../controllers/user.controller/register.js";
import { verifyUser } from "../../controllers/user.controller/verify.user.js";
/* import { verifyToken } from "../../middleware/verify.token.js"; */

const router = express.Router();

router.post("/register", register);
router.post("/verify", verifyUser);
router.post("/login", login);
router.post("/sendOtpNewPassword", sendOtpNewPassword);
router.post("/newPassword", newPassword);
router.get("/user", user);

export default router;

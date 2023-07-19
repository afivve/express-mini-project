import express from "express";
import userRoutes from "./user.route/route.js";
import otpRoutes from "./otp.route/route.js";
import emailVerifyRoutes from "./email.verification/route.js";

const router = express.Router();

router.use("/", userRoutes);
router.use("/otp", otpRoutes);
router.use("/emailVerification", emailVerifyRoutes);

export default router;

const express = require("express");
const userRoutes = require("./user.route/route.js");
const profileRoutes = require("./profile.route/route.js");
const adminRoutes = require("./admin.route/route.js");

const router = express.Router();

router.use("/", userRoutes);
router.use("/", profileRoutes);
router.use("/", adminRoutes);

module.exports = router;

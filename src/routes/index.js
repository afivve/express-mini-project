const express = require("express");
const userRoutes = require("./user.route/route.js");
const profileRoutes = require("./profile.route/route.js");

const router = express.Router();

router.use("/", userRoutes);
router.use("/", profileRoutes);

module.exports = router;

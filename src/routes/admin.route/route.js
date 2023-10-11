const express = require("express");
const { admin } = require("../../middleware/user.role.js");
const { verifyToken } = require("../../middleware/verify.token.js");

const {
  readAllProfile,
  readProfileById,
} = require("../../controllers/admin.controller/read.profile");

const router = express.Router();

router.get("/all-profile", verifyToken, admin, readAllProfile);
router.get("/profile/:id", verifyToken, admin, readProfileById);

module.exports = router;

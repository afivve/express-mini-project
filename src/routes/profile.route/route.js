const express = require("express");
const {
  createProfile,
} = require("../../controllers/profile.controller/create.profile");
const {
  readProfile,
  readAllProfile,
  readProfileById,
} = require("../../controllers/profile.controller/read.profile");
const {
  updateProfile,
  changePassword,
} = require("../../controllers/profile.controller/update.profile");
const { verifyToken } = require("../../middleware/verify.token.js");
const { admin } = require("../../middleware/user.role.js");
const {
  uploadPhoto,
} = require("../../controllers/photo.profile.controller/upload.photo");
const {
  readPhoto,
} = require("../../controllers/photo.profile.controller/read.photo");
const {
  deletePhoto,
} = require("../../controllers/photo.profile.controller/delete.photo");

const router = express.Router();

router.post("/profile", verifyToken, createProfile);
router.get("/profile", verifyToken, readProfile);
router.put("/profile", verifyToken, updateProfile);

router.get("/allProfile", verifyToken, admin, readAllProfile);
router.get("/profile/:id", verifyToken, admin, readProfileById);

router.post("/photoProfile", verifyToken, uploadPhoto);
router.get("/photoProfile", verifyToken, readPhoto);
router.delete("/photoProfile", verifyToken, deletePhoto);

router.put("/changePassword", verifyToken, changePassword);

module.exports = router;

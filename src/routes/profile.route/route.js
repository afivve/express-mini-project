const express = require("express");

const {
  createProfile,
} = require("../../controllers/profile.controller/create.profile");

const {
  readProfile,
} = require("../../controllers/profile.controller/read.profile");

const {
  updateProfile,
} = require("../../controllers/profile.controller/update.profile");

const { verifyToken } = require("../../middleware/verify.token.js");

const {
  uploadPhoto,
} = require("../../controllers/photo.profile.controller/upload.photo");

const {
  deletePhoto,
} = require("../../controllers/photo.profile.controller/delete.photo");

const {
  updatePhoto,
} = require("../../controllers/photo.profile.controller/update.photo");

const router = express.Router();

// PROFILE Route
router.post("/profile/", verifyToken, createProfile);
router.get("/profile/", verifyToken, readProfile);
router.put("/profile", verifyToken, updateProfile);

// PHOTO PROFILE Route
router.post("/photo-profile", verifyToken, uploadPhoto);
router.put("/photo-profile", verifyToken, updatePhoto);
router.delete("/photo-profile", verifyToken, deletePhoto);

module.exports = router;

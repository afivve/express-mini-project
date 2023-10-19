const express = require("express"),
  validate = require("../middleware/validation"),
  schema = require("../validation/auth.validation"),
  controller = require("../controllers/auth.controller/index");

router = express.Router();

router.post("/register", validate(schema.register), controller.register);
router.post("/verify-user", controller.verifyUser);
router.post("/login", validate(schema.login), controller.login);
router.post("/refresh-token", controller.refreshToken);
router.post("/change-password", controller.changePassword);
router.post("/logout", controller.logout);
router.post("/new-password", controller.newPassword);

module.exports = router;

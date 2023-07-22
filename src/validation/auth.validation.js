const { body } = require("express-validator");

const registerValidator = [
  body("name").notEmpty().withMessage("Nama wajib diisi"),
  body("email").notEmpty().isEmail().withMessage("Email tidak valid"),
  body("password")
    .notEmpty()
    .withMessage("Password wajib diisi")
    .isLength({ min: 8 })
    .withMessage("Kata sandi minimal 8 karakter"),
  body("confPassword")
    .notEmpty()
    .withMessage("Konfirmasi password wajib diisi")
    .custom((confPassword, { req }) => {
      if (confPassword !== req.body.password) {
        throw new Error("Konfirmasi password dan password tidak cocok");
      }
      return true;
    }),
];

const loginValidator = [
  body("email").notEmpty().isEmail().withMessage("Email tidak valid"),
  body("password")
    .notEmpty()
    .withMessage("Password wajib diisi")
    .isLength({ min: 8 })
    .withMessage("Kata sandi minimal 8 karakter"),
];

const verifyUserValidator = [
  body("email").notEmpty().isEmail().withMessage("Email tidak valid"),
  body("otp").notEmpty(),
];

const sendOtpNewPasswordValidator = [
  body("email").notEmpty().isEmail().withMessage("Email tidak valid"),
];

const newPasswordValidator = [
  body("email").notEmpty().isEmail().withMessage("Email tidak valid"),
  body("otp").notEmpty(),
  body("password")
    .notEmpty()
    .withMessage("Password wajib diisi")
    .isLength({ min: 8 })
    .withMessage("Kata sandi minimal 8 karakter"),
  body("confPassword")
    .notEmpty()
    .withMessage("Konfirmasi password wajib diisi")
    .custom((confPassword, { req }) => {
      if (confPassword !== req.body.password) {
        throw new Error("Konfirmasi password dan password tidak cocok");
      }
      return true;
    }),
];

module.exports = {
  registerValidator,
  loginValidator,
  verifyUserValidator,
  sendOtpNewPasswordValidator,
  newPasswordValidator,
};

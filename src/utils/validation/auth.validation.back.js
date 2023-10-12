const { body } = require("express-validator");

module.exports = {
  registerValidation: async (req, res, next) => {
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
        });
  },
  login: [
    body("email").notEmpty().isEmail().withMessage("Email tidak valid"),
    body("password")
      .notEmpty()
      .withMessage("Password wajib diisi")
      .isLength({ min: 8 })
      .withMessage("Kata sandi minimal 8 karakter"),
  ],
  verifyUser: [
    body("email").notEmpty().isEmail().withMessage("Email tidak valid"),
    body("otp").notEmpty(),
  ],
  sendOtpNewPassword: [
    body("email").notEmpty().isEmail().withMessage("Email tidak valid"),
  ],
  newPassword: [
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
  ],
  changePassword: [
    body("currentPassword")
      .notEmpty()
      .withMessage("Password wajib diisi")
      .isLength({ min: 8 })
      .withMessage("Kata sandi minimal 8 karakter"),
    body("newPassword")
      .notEmpty()
      .withMessage("Password wajib diisi")
      .isLength({ min: 8 })
      .withMessage("Kata sandi minimal 8 karakter"),
    body("confPassword")
      .notEmpty()
      .withMessage("Konfirmasi password wajib diisi")
      .custom((confPassword, { req }) => {
        if (confPassword !== req.body.newPassword) {
          throw new Error("Konfirmasi password dan password baru tidak cocok");
        }
        return true;
      }),
  ],
};

/* register: [
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
], */

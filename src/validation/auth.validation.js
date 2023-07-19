import { body } from "express-validator";

export const registerValidator = [
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

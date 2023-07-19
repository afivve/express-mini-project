import { nanoid } from "nanoid";
import { validationResult } from "express-validator";

import { registerValidator } from "../../validation/auth.validation.js";

import { error, success } from "../../utils/response.js";
import { hashData, verifyHashedData } from "../../utils/hash.data.js";
import { createToken } from "../../utils/create.token.js";

import User from "../../models/user.model.js";

export const user = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
  }
};

/* export const register = async (req, res) => {
  const { name, email, password, confPassword } = req.body;

  await Promise.all(registerValidator.map((validator) => validator.run(req)));

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json(error(errorMessages.join(", ")));
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser)
      return res.status(409).json(error("Email sudah terdaftar"));

    const hashPassword = await hashData(password);

    const userId = nanoid();

    await prisma.user.create({
      data: {
        id: userId,
        name: name,
        email: email,
        password: hashPassword,
      },
    });

    res.status(201).json(success("Berhasil Mendaftar", { name, email }));
  } catch (err) {
    console.log(err);
    res.status(500).json(error("Kesalahan Server"));
  }
};

export const login = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (!user) return res.status(404).json(error("Email tidak ditemukan"));

    const hashedPassword = user.password;
    const passwordMatch = await verifyHashedData(
      req.body.password,
      hashedPassword
    );
    if (!passwordMatch) return res.status(403).json(error("Password Salah"));

    const { id, name, email } = user;
    const tokenData = { id, name, email };
    const token = await createToken(tokenData);

    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        token: token,
      },
    });

    res.status(200).json(
      success("Login Berhasil", {
        id: id,
        name: name,
        email: email,
        token: token,
      })
    );
  } catch (err) {
    console.log(err);
    res.status(500).json(error("Kesalahan Server"));
  }
}; */

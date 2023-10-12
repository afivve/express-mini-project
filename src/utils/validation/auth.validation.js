const Joi = require("joi");
const { isEmailExistsJoi } = require("../../helpers/exists.helper");

module.exports = {
  register: async (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string()
        .email()
        .max(255)
        .required()
        .external(async (email) => isEmailExistsJoi(email)),
      password: Joi.string().min(8).required(),
      confPassword: Joi.ref("password"),
    });

    try {
      await schema.validateAsync(req.body);
      next();
    } catch (err) {
      return res.json({ message: "Error Validate" });
    }
  },

  login: async (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string().email().max(255).required(),
      password: Joi.string().min(8).required(),
    });

    try {
      await schema.validateAsync(req.body);
      next();
    } catch (err) {
      return res.json({ message: "Error Validate" });
    }
  },
};

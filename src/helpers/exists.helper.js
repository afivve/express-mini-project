const { User } = require("../database/models");
const Joi = require("joi");

const customThrowErrorJoiString = (msg, field) => {
  throw new Joi.ValidationError(
    msg,
    [
      {
        message: msg,
        path: [field],
        type: `string.${field}`,
        context: {
          key: field,
          label: field,
          field,
        },
      },
    ],
    field
  );
};

module.exports = {
  isEmailExistsJoi: async (email) => {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (user)
      customThrowErrorJoiString("Username already been taken", "username");

    return true;
  },
};

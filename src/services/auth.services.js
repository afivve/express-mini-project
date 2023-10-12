const { User } = require("../database/models");
const { nanoid } = require("nanoid");
const HashData = require("../utils/hash.data.js");
const apiResponse = require("../utils/response");

const { AUTH_EMAIL } = process.env;

module.exports = {
  register: async (payload) => {
    try {
      const { email, password } = payload;

      const uuid = nanoid();
      const hashed_password = await HashData.create(password);

      const user = await User.create({
        uuid: uuid,
        email: email,
        password: hashed_password,
      });
      user.password = undefined;
    } catch (err) {
      console.error(err);
    }
  },
};

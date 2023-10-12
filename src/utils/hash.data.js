const bcrypt = require("bcrypt");

module.exports = {
  create: async (data, saltRounds = 10) => {
    try {
      const hashed_data = await bcrypt.hash(data, saltRounds);
      return hashed_data;
    } catch (err) {
      throw err;
    }
  },

  verify: async (unhashed, hashed) => {
    try {
      const match = await bcrypt.compare(unhashed, hashed);
      return match;
    } catch (err) {
      throw err;
    }
  },
};

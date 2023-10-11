const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");

("use strict");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", [
      {
        uuid: nanoid(),
        email: "example@example.com",
        password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10)),
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};

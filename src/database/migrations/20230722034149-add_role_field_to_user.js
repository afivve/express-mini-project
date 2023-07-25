"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return [
      queryInterface.addColumn("users", "role", {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "user",
      }),
    ];
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([queryInterface.changeColumn("users", "role")]);
  },
};

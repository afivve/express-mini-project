"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Profile.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    }
  }
  Profile.init(
    {
      name: DataTypes.STRING,
      gender: DataTypes.STRING,
      birthDate: DataTypes.DATEONLY,
      age: DataTypes.INTEGER,
      city: DataTypes.STRING,
      country: DataTypes.STRING,
      userId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Profile",
    }
  );
  return Profile;
};

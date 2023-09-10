"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PhotoProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PhotoProfile.belongsTo(models.User, { foreignKey: "email", as: "user" });
    }
  }
  PhotoProfile.init(
    {
      urlPhoto: DataTypes.STRING,
      email: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "PhotoProfile",
    }
  );
  return PhotoProfile;
};

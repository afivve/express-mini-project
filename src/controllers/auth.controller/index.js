const register = require("./register.controller");
const verifyUser = require("./verifyUser.controller");
const login = require("./login.controller");
const refreshToken = require("./refreshToken.controller");
const changePassword = require("./changePassword.controller");
const logout = require("./logout.controller.");
const newPassword = require("./forgotPassword.controller");

module.exports = {
  register,
  verifyUser,
  login,
  refreshToken,
  changePassword,
  logout,
  newPassword,
};

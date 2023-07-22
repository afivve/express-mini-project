const { User } = require("../../database/models");

const user = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  user,
};

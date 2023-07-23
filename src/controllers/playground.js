const { User } = require("../database/models");

const user = async (req, res) => {
  const email = req.email;
  try {
    const users = await User.findOne({
      where: {
        email: email,
      },
    });
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  user,
};

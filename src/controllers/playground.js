const model = require("../database/models");
const User = model.User;
const Profile = model.Profile;

const user = async (req, res) => {
  const email = req.email;
  try {
    const user = await User.findOne({
      where: {
        email: email,
      },
      include: Profile,
      as: "userProfile",
      /* attributes: ["email", "name", "role", "verified"],
      include: {
        model: Profile,
        attributes: ["address", "gender"],
      }, */
    });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  user,
};

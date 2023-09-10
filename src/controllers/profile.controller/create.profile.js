const model = require("../../database/models");
const User = model.User;
const Profile = model.Profile;

const createProfile = async (req, res) => {
  const email = req.email;
  const { name, gender, birthDate, city, country } = req.body;

  try {
    if (!email) return res.status(400).json("Silahkan Login Terlebih Dahulu");

    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    const existingProfile = await Profile.findOne({
      where: {
        email: user.email,
      },
    });

    if (existingProfile) {
      return res.status(200).json("Profile Sudah dibuat");
    }

    const birth_date = new Date(birthDate);
    const current_date = new Date();
    const ageInMilliseconds = current_date - birth_date;
    const age = Math.floor(ageInMilliseconds / (365.25 * 24 * 60 * 60 * 1000));

    const profile = await Profile.create({
      name: name,
      gender: gender,
      birthDate: birth_date,
      age: age,
      city: city,
      country: country,
      email: user.email,
    });

    return res.status(201).json(profile);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createProfile,
};

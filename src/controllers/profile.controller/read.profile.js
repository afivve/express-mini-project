const models = require("../../database/models");
const User = models.User;
const Profile = models.Profile;

const readProfile = async (req, res) => {
  const email = req.email;
  try {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).json("Pengguna tidak ditemukan");
    }

    const profile = await Profile.findOne({
      where: {
        UserId: user.id,
      },
    });

    if (!profile) {
      return res.status(404).json("Profil tidak ditemukan");
    }

    const response = {
      profile: {
        id: user.id,
        email: user.email,
        name: profile.name,
        role: user.role,
        gender: profile.gender,
        birthDate: profile.birthDate,
        age: profile.age,
        address: {
          city: profile.city,
          country: profile.country,
        },
      },
    };

    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(500).json("Gagal membaca profil");
  }
};

const readAllProfile = async (req, res) => {
  const profiles = await Profile.findAll();
  res.status(200).json(profiles);
};

const readProfileById = async (req, res) => {
  const { id } = req.params;

  const profile = await Profile.findOne({
    where: {
      userId: id,
    },
  });

  res.status(200).json(profile);
};

module.exports = {
  readProfile,
  readAllProfile,
  readProfileById,
};

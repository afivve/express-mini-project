const models = require("../../database/models");
const User = models.User;
const Profile = models.Profile;
const PhotoProfile = models.PhotoProfile;

const { error, success } = require("../../utils/response.js");

const readProfile = async (req, res) => {
  const email = req.email;
  try {
    if (!email)
      return res.status(401).json(error("Silahkan Login Terlebih Dahulu"));

    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    const profile = await Profile.findOne({
      where: {
        email: user.email,
      },
    });

    if (!profile) {
      return res.status(404).json(error("Profil tidak ditemukan"));
    }

    const photo_profile = await PhotoProfile.findOne({
      where: {
        email: user.email,
      },
    });

    const data = {
      profile: {
        id: user.id,
        uuid: user.uuid,
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
        photoProfile: photo_profile
          ? photo_profile.urlPhoto
          : "src/public/default/default.png",
      },
    };

    return res
      .status(200)
      .json(success("Berhasil Mendapatkan Data Profile", data));
  } catch (err) {
    console.log(err);
    return res.status(500).json(error("Gagal membaca profil"));
  }
};

const readAllProfile = async (req, res) => {
  const profiles = await Profile.findAll();
  res.status(200).json(profiles);
};

const readProfileById = async (req, res) => {
  const { uuid } = req.params;

  const profile = await Profile.findOne({
    where: {
      uuid: uuid,
    },
  });

  res.status(200).json(profile);
};

module.exports = {
  readProfile,
  readAllProfile,
  readProfileById,
};

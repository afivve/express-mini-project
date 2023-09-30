const model = require("../../database/models");
const User = model.User;
const Profile = model.Profile;

const { error, success } = require("../../utils/response.js");

const updateProfile = async (req, res) => {
  const email = req.email;
  const { name, gender, birthDate, city, country } = req.body;

  try {
    if (!email)
      return res.status(401).json(error("Silahkan Login Terlebih Dahulu"));

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
        uuid: user.uuid,
      },
    });

    if (!profile) {
      return res.status(404).json("Data Profil belum dibuat");
    }

    const birth_date = new Date(birthDate);
    const current_date = new Date();
    const age_in_milliseconds = current_date - birth_date;
    const age = Math.floor(
      age_in_milliseconds / (365.25 * 24 * 60 * 60 * 1000)
    );

    await Profile.update(
      {
        name: name,
        gender: gender,
        birthDate: birth_date,
        age: age,
        city: city,
        country: country,
      },
      {
        where: {
          uuid: user.uuid,
        },
      }
    );

    const updatedProfile = {
      profile: {
        id: user.uuid,
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

    return res
      .status(201)
      .json(success("Profil Berhasil Diperbarui", updatedProfile));
  } catch (err) {
    console.log(err);
    return res.status(500).json("Terjadi kesalahan saat mengupdate profil");
  }
};

module.exports = {
  updateProfile,
};

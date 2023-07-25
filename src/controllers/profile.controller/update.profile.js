const model = require("../../database/models");
const { verifyHashedData, hashData } = require("../../utils/hash.data");
const User = model.User;
const Profile = model.Profile;

const updateProfile = async (req, res) => {
  const email = req.email;
  const { name, gender, birthDate, city, country } = req.body;

  try {
    if (!email) return res.status(400).json("Silahkan Login Terlebih Dahulu");

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
        userId: user.id,
      },
    });

    if (!profile) {
      return res.status(404).json("Profil tidak ditemukan");
    }

    const birth_date = new Date(birthDate);
    const current_date = new Date();
    const ageInMilliseconds = current_date - birth_date;
    const age = Math.floor(ageInMilliseconds / (365.25 * 24 * 60 * 60 * 1000));

    // Update data profil
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
          userId: user.id,
        },
      }
    );

    const updatedProfile = {
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

    return res.status(200).json(updatedProfile);
  } catch (err) {
    console.log(err);
    return res.status(500).json("Terjadi kesalahan saat mengupdate profil");
  }
};

const changePassword = async (req, res) => {
  const email = req.email;
  const { currentPassword, newPassword } = req.body;
  try {
    if (!email) return res.status(400).json("Silahkan Login Terlebih Dahulu");

    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).json("Pengguna tidak ditemukan");
    }

    const current_password = user.password;
    const verify_current_password = await verifyHashedData(
      currentPassword,
      current_password
    );

    if (!verify_current_password) {
      return res.status(200).json("Password Salah");
    }

    const hash_password = await hashData(newPassword);

    await User.update(
      { password: hash_password },
      {
        where: {
          email: email,
        },
      }
    );

    return res.status(200).json("Password berhasil diubah");
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  updateProfile,
  changePassword,
};

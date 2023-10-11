const { User, Profile } = require("../../database/models");

const { error, success } = require("../../utils/response.js");

const updateProfile = async (req, res) => {
  const uuid = req.uuid;
  const { name, gender, birthDate, city, country } = req.body;

  try {
    if (!uuid)
      return res.status(401).json(error("Silahkan Login Terlebih Dahulu"));

    const user = await User.findOne({
      where: {
        uuid: uuid,
      },
    });

    const profile = await Profile.findOne({
      where: {
        userId: user.id,
      },
    });

    if (!profile) {
      return res.status(404).json("Gagal Update. Data Profil belum dibuat");
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
          userId: user.id,
        },
      }
    );

    const response = {
      uuid: user.uuid,
      email: user.email,
      name: name,
      gender: gender,
      birthDate: birthDate,
      age: age,
      address: {
        city: city,
        country: country,
      },
      role: user.role,
    };

    return res
      .status(201)
      .json(success("Profil Berhasil Diperbarui", response));
  } catch (err) {
    console.log(err);
    return res.status(500).json("Terjadi kesalahan saat mengupdate profil");
  }
};

module.exports = {
  updateProfile,
};

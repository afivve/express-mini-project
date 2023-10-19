const { User, Profile } = require("../../database/models");
const apiResponse = require("../../utils/response.js");

const createProfile = async (req, res) => {
  const uuid = req.uuid;
  const { name, gender, birthDate, city, country } = req.body;

  try {
    if (!uuid)
      return res
        .status(401)
        .json(apiResponse.error("Silahkan Login Terlebih Dahulu"));

    const user = await User.findOne({
      where: {
        uuid: uuid,
      },
    });

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
      userId: user.id,
    });

    const response = {
      uuid: user.uuid,
      name: profile.name,
      ender: gender,
      birthDate: birth_date,
      age: age,
      adrress: {
        city: city,
        country: country,
      },
    };

    return res
      .status(201)
      .json(apiResponse.success("Data Profil Berhasil Dibuat", response));
  } catch (err) {
    console.log(err);
    return res.status(500).json(apiResponse.error("Terjadi Kesalahan Server"));
  }
};

module.exports = createProfile;

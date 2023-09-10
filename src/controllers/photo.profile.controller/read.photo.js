const models = require("../../database/models");
const User = models.User;
const PhotoProfile = models.PhotoProfile;

const { error, success } = require("../../utils/response.js");

const readPhoto = async (req, res) => {
  const email = req.email;

  try {
    if (!email)
      return res.status(401).json(error("Silahkan Login Terlebih Dahulu"));

    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    const photo_profile = await PhotoProfile.findOne({
      where: {
        email: user.email,
      },
    });

    if (!photo_profile) {
      return res.status(404).json(error("Foto Profil Tidak Ada"));
    }

    const urlPhoto = photo_profile.urlPhoto;

    return res.status(200).json(
      success("Berhasil Mengambil Data Foto Profil", {
        urlPhoto: urlPhoto,
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json(error("Terjadi Kesalahan Server"));
  }
};

module.exports = {
  readPhoto,
};

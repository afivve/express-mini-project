const fs = require("fs");
const path = require("path");

const models = require("../../database/models");
const User = models.User;
const PhotoProfile = models.PhotoProfile;

const { error, success } = require("../../utils/response.js");

const deletePhoto = async (req, res) => {
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

    const folder_name = req.email;
    const folder_path = `src/public/uploads/profile/${folder_name}`;

    if (fs.existsSync(folder_path)) {
      fs.rmdirSync(folder_path, { recursive: true });
      photo_profile.destroy();
      return res.status(201).json(success("Foto Profil Berhasil Dihapus"));
    } else {
      return res.status(404).json(error("Foto Profil tidak ada"));
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(error("Terjadi Kesalahan Server"));
  }
};

module.exports = {
  deletePhoto,
};

const fs = require("fs");
const model = require("../../database/models");
const User = model.User;
const PhotoProfile = model.PhotoProfile;
const multer = require("multer");

const { error, success } = require("../../utils/response.js");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const email = req.email;
    const folder = `src/public/uploads/profile/${email}`;
    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = file.originalname.split(".").pop();
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + extension);
  },
});

const allowed_file_types = ["image/jpeg", "image/jpg", "image/png"];
const max_file_size = 1 * 1024 * 1024;

const filter = (req, file, cb) => {
  if (!allowed_file_types.includes(file.mimetype)) {
    const error = {
      error: true,
      message: "Tipe file tidak diizinkan",
    };
    return cb(error);
  }

  if (file.size > max_file_size) {
    const error = {
      error: true,
      message: "Ukuran file terlalu besar",
    };
    return cb(error);
  }

  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: filter,
  limits: {
    fileSize: max_file_size,
  },
});

const uploadPhoto = async (req, res) => {
  const email = req.email;

  try {
    if (!email)
      return res.status(401).json(error("Silahkan Login Terlebih Dahulu"));

    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).json(error("User tidak ditemukan"));
    }

    const existing_photo_profile = await PhotoProfile.findOne({
      where: {
        email: user.email,
      },
    });

    if (!existing_photo_profile) {
      const singleUpload = upload.single("photo");
      singleUpload(req, res, async (err) => {
        if (err) {
          console.log(err);
          return res.status(400).json(error(err.message));
        }

        if (!req.file) {
          return res.status(400).json("Mohon unggah file foto");
        }
        const url_photo = req.file.path;

        await PhotoProfile.create({
          urlPhoto: url_photo,
          userId: user.id,
          email: user.email,
        });

        res
          .status(201)
          .json(success("Foto berhasil diupload", { urlPhoto: url_photo }));
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Terjadi kesalahan server");
  }
};

module.exports = {
  uploadPhoto,
};

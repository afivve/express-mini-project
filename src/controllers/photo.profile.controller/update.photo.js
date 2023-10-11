const fs = require("fs");
const model = require("../../database/models");
const User = model.User;
const PhotoProfile = model.PhotoProfile;
const multer = require("multer");

const { error, success } = require("../../utils/response.js");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const email = req.email;
    const folder = `public/uploads/photo.profile/${email}`;
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

const updatePhoto = async (req, res) => {
  const uuid = req.uuid;

  try {
    if (!uuid)
      return res.status(401).json(error("Silahkan Login Terlebih Dahulu"));

    const user = await User.findOne({
      where: {
        uuid: uuid,
      },
    });

    const existing_photo_profile = await PhotoProfile.findOne({
      where: {
        userId: user.id,
      },
    });

    if (!existing_photo_profile)
      return res.status(500).json(error("Photo Profile Sudah Diupload"));

    if (existing_photo_profile) {
      fs.unlink(existing_photo_profile.urlPhoto, (unlinkErr) => {
        if (unlinkErr) {
          console.log(unlinkErr);
          return res.status(500).json(error("Gagal Update Foto Profil"));
        }

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

          await PhotoProfile.update(
            {
              urlPhoto: url_photo,
            },
            {
              where: {
                userId: user.id,
              },
            }
          );

          res
            .status(201)
            .json(success("Foto berhasil diperbarui", { urlPhoto: url_photo }));
        });
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Terjadi kesalahan server");
  }
};

module.exports = {
  updatePhoto,
};

const { User, Profile, PhotoProfile } = require("../../database/models");
const apiResponse = require("../../utils/response.js");

const readProfile = async (req, res) => {
  const uuid = req.uuid;

  try {
    const user = await User.findOne({
      where: { uuid: uuid },
      include: [
        { model: Profile, as: "profile" },
        { model: PhotoProfile, as: "photoProfile" },
      ],
    });

    const photo_profile = await PhotoProfile.findOne({
      where: {
        userId: user.id,
      },
    });

    const response = {
      uuid: user.uuid,
      email: user.email,
      name: user.profile.name ?? "",
      gender: user.profile.gender ?? "",
      birthDate: user.profile.birthDate ?? "",
      age: user.profile.age ?? "",
      address: {
        city: user.profile.city ?? "",
        country: user.profile.country ?? "",
      },
      photoProfile: photo_profile
        ? photo_profile.urlPhoto
        : "public/default/default.png",
      role: user.role,
    };

    return res
      .status(200)
      .json(apiResponse.success("Berhasil Mendapatkan Data Profile", response));

    /* const photo_profile = await PhotoProfile.findOne({
      where: {
        email: user.email,
      },
    }); */

    // const data = {
    //   profile: {
    //     id: profile.id,
    //     uuid: profile.uuid,
    //     email: profile.email,
    //     name: profile.name,
    //     role: profile.users.role,
    //     gender: profile.profile.gender,
    //     birthDate: profile.profile.birthDate,
    //     age: profile.profile.age,
    //     address: {
    //       city: profile.profile.city,
    //       country: profile.profile.country,
    //     },
    //     /* photoProfile: photo_profile
    //       ? photo_profile.urlPhoto
    //       : "src/public/default/default.png", */
    //   },
    // };
  } catch (err) {
    console.log(err);
    return res.status(500).json(apiResponse.error("Gagal membaca profil"));
  }
};

module.export = readProfile;

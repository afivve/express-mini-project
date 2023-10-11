const { User, Profile, PhotoProfile } = require("../../database/models");

const { error, success } = require("../../utils/response.js");

const readAllProfile = async (req, res) => {
  const users = await User.findAll({
    include: [
      { model: Profile, as: "profile" },
      { model: PhotoProfile, as: "photoProfile" },
    ],
  });

  const response = users.map((user) => ({
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
    role: user.role,
  }));

  res.status(200).json(success("Success Fetched All Profile Data", response));
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
  readAllProfile,
  readProfileById,
};

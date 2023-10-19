const { User } = require("../../database/models");
const apiResponse = require("../../utils/response.js");

const logout = async (req, res) => {
  const refresh_token = req.cookies.refreshToken;
  if (!refresh_token)
    return res.status(204).json(apiResponse.error("Gagal Logout"));
  const user = await User.findAll({
    where: {
      refreshToken: refresh_token,
    },
  });
  if (!user[0]) return res.status(204).json(apiResponse.error("Gagal Logout"));
  const user_id = user[0].id;
  await User.update(
    { refreshToken: null },
    {
      where: {
        id: user_id,
      },
    }
  );
  res.clearCookie("refreshToken");
  return res.status(200).json(apiResponse.success("Berhasil Logout"));
};

module.exports = logout;

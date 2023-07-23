const bcrypt = require("bcrypt");

const hashData = async (data, saltRounds = 10) => {
  try {
    const hashed_data = await bcrypt.hash(data, saltRounds);
    return hashed_data;
  } catch (err) {
    throw err;
  }
};

const verifyHashedData = async (unhashed, hashed) => {
  try {
    const match = await bcrypt.compare(unhashed, hashed);
    return match;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  hashData,
  verifyHashedData,
};

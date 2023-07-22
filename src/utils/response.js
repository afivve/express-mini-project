const success = (msg, data = null) => {
  return {
    error: false,
    message: msg,
    data: data,
  };
};

const error = (msg, data = null) => {
  return {
    error: true,
    message: msg,
  };
};

module.exports = {
  success,
  error,
};

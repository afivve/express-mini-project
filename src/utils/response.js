module.exports = {
  success: (msg, data) => {
    const response = {};
    response.error = false;
    response.message = msg;
    response.data = data;

    return response;
  },
  error: (msg, data = null) => {
    return {
      error: true,
      message: msg,
    };
  },
};

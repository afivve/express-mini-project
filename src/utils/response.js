export const success = (msg, data = null) => {
  return {
    error: false,
    message: msg,
    data: data,
  };
};

export const error = (msg, data = null) => {
  return {
    error: true,
    message: msg,
  };
};

export const sendResponse = (res, statusCode, message) => {
  res.status(statusCode).json({ message });
};

const { validationResult } = require("express-validator");
const apiResponse = require("../utils/response.js");

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const validation_errors = validationResult(req);

    if (!validation_errors.isEmpty()) {
      const error_messages = validation_errors
        .array()
        .map((error) => error.msg);
      return res.status(400).json(apiResponse.error(error_messages.join(", ")));
    }

    return next();
  };
};

module.exports = validate;

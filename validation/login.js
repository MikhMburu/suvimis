const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.user_email = !isEmpty(data.user_email) ? data.user_email : "";
  data.user_password = !isEmpty(data.user_password) ? data.user_password : "";

  if (Validator.isEmpty(data.user_email)) {
    errors.user_email = "Email field is required";
  }
  if (Validator.isEmpty(data.user_password)) {
    errors.user_password = "Password field is required";
  }

  if (!Validator.isEmail(data.user_email)) {
    errors.user_email = "Email is invalid";
  }
  if (!Validator.isLength(data.user_password, { min: 6, max: 30 })) {
    errors.user_password = "Password must be between 6 and 30 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

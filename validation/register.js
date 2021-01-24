const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateRegisterInput(data) {
  let errors = {};
  data.user_name = !isEmpty(data.user_name) ? data.user_name : "";
  data.user_email = !isEmpty(data.user_email) ? data.user_email : "";
  data.user_password = !isEmpty(data.user_password) ? data.user_password : "";
  data.user_password2 = !isEmpty(data.user_password2) ? data.user_password2 : "";

  if (!Validator.isLength(data.user_name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 30 characters";
  }
  if (Validator.isEmpty(data.user_name)) {
    errors.name = "Name field is required";
  }
  if (Validator.isEmpty(data.user_email)) {
    errors.email = "Email field is required";
  }
  if (Validator.isEmpty(data.user_password)) {
    errors.password = "Password field is required";
  }
  if (Validator.isEmpty(data.user_password2)) {
    errors.password2 = "Password field is required";
  }
  if (!Validator.isEmail(data.user_email)) {
    errors.email = "Email is invalid";
  }
  if (!Validator.isLength(data.user_password, { min: 6, max: 30 })) {
    errors.password = "Password must be between 6 and 30 characters";
  }
  if (!Validator.equals(data.user_password, data.user_password2)) {
    errors.pasword2 = "Passwords must match";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};

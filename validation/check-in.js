// Import libraries
const { default: validator } = require("validator");
const Validator = require("validator");
// Import files
const isEmpty = require("./isEmpty");
// Define Variables
// Define Functions
module.exports = validateCheckInForm = (data) =>{
  let errors = {};

  data.t_name = !isEmpty(data.t_name)? data.t_name: "";
  data.natID = !isEmpty(data.natID)? data.natID: "";
  data.t_email = !isEmpty(data.t_email)? data.t_email: "";
  data.t_phoneno = !isEmpty(data.t_phoneno)? data.t_phoneno: "";
  
  if(Validator.isEmpty(data.t_name)){
    errors.t_name = "Please fill in your full name";
  };
  if(Validator.isEmpty(data.natID)){
    errors.natID = "Please fill in your national ID or Passport Number";
  };
  if(Validator.isEmpty(data.t_email)){
    errors.t_email = "Please fill in your email address";
  };
  if(!Validator.isEmail(data.t_email)){
    errors.t_email = "The email format is wrong"
  }
  if(Validator.isEmpty(data.t_phoneno)){
    errors.t_phoneno = "Please fill in your phone number";
  };

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
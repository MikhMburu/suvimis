// Import libraries
const mongoose = require("mongoose");
// Import files and/or variables
// Define variables
const Schema = mongoose.Schema;
// Create schema
const personSchema = new Schema({
  fullName: {
    type: String,
    required: true
  },
  natID: {
    type: String,
  },
  email: {
    type: String,
    required: true    
  },
  phoneNumber: {
    type: String,
  },
  gender: {
    type:String,
    default: "Male"
  },
  designation: {
    type: String,
    default: "Tenant",
    required: true
  },
  next_of_kin: {
      fullName:{
        type: String
      },
      email: {
        type: String
      },
      phoneNumber: {
        type: String
      },
      relation: {
        type: String
      }
    },  
  bank: {
    type: String,
  },
  acc_no: {
    type: String,
  },
  password: {
    type: String
  }

})
// Export model
module.exports = Person = mongoose.model("persons", personSchema);
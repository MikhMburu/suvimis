// Import Libraries
const bcrypt = require("bcryptjs");
// Define variables
// Define functions
const pswd_hash = (pswd)=>{
  bcrypt.genSalt(10, (err, salt)=>{
    bcrypt.hash(pswd, salt, (err, hash)=>{
      if(err) throw err;      
    })
    return hash
  })
}
// Export Function
module.exports = pswd_hash
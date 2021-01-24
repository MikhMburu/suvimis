// Import libraries
const express = require("express");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const passport = require("passport");
// Import Files and variables
const User = require("../../models/Person");
const {secretKey} = require("../../config/keys");
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
require("../../config/passport")(passport);
// Define variables
const router = express.Router();
// Define functions
// Create routes
// @route:   /api/user/test
// @desc:    Tests the tenant route
// @access:  public
router.get("/test", (req, res) => res.send("User router working perfectly"));
// @route:   /api/user/register
// @desc:    Register a new user
// @access:  public
router.post("/register", (req, res) => {
  // Validate register input
  const {errors, isValid}=validateRegisterInput(req.body);
  if(!isValid){
    return res.status(400).json(errors)
  }
  try {
    // Check whether email exists
    User.findOne({email: req.body.user_email})
      .then(user=>{
        if(user){
          errors.email = "Email already exists. Use another.."
          return res.status(400).json(errors)
        }else{
          let newUser = new User({
            fullName: req.body.user_name,
            email: req.body.user_email,
            password: req.body.user_password,
            designation: "Admin"
          })       
        //  Hash Password
          bcrypt.genSalt(15,(err, salt)=>{
            bcrypt.hash(newUser.password,salt, async (err, hash)=>{
              if(err) throw err;
              newUser.password = hash;
              const user = await newUser.save();
              res.json(user)
            })
          })
        }
      })
      .catch(err=>{
        errors.connection_error= "Sorry, something went wrong"
        res.status(400).json(errors);
      })  
   

  } catch (err) {
    res.status(400).json({ save_error: "Unable to save user" })
  }

})

// @route:   /api/user/login
// @desc:    Return a token
// @access:  public
router.post("/login", (req, res)=>{
  // Validate Login input

  const {errors, isValid} = validateLoginInput(req.body);
  if(!isValid){
    return res.status(400).json(errors)
  }
  const email = req.body.user_email;
  const password = req.body.user_password
  // Check whether email exists
  User.findOne({email})
    .then(user=>{
      if(!user){
        errors.email = "Email not found.."
        res.status(404).json(errors);
      }else{
        // Compare hashed passwords
        bcrypt.compare(password, user.password)
          .then(isMatch=>{
            if(isMatch){
              // TODO: Create and send token
              const payload = {
                name: user.fullName,
                email: user.email,
                designation: user.designation
              }
              // Sign user and send token
              jwt.sign(
                payload, 
                secretKey, 
                {expiresIn: 86400}, 
                (err,token)=>{
                  if(err){
                    throw err;
                  }else{
                    res.json({
                      success: true,
                      token: `Bearer ${token}`
                    });
                  } 
              })
            }else{
              errors.password = "Password does not match";
              res.status(400).json(errors)
            }
          })
          .catch(err=> {throw err})
      }
    })
})

// @route:   /api/user/current
// @desc:    Return logged in user
// @access:  private
router.get(
  "/current", 
  passport.authenticate("jwt", {session: false}),
  (req, res)=>{
    res.json(req.user);
})

// export router
module.exports = router;
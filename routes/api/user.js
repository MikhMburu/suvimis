// Import libraries
const express = require("express");
// Import Files and variables
// Define variables
const router = express.Router();
// Define functions
// Create routes
  // @route:   /api/user/test
  // @desc:    Tests the tenant route
  // @access:  public
  router.get("/test", (req,res)=>res.send("User router working perfectly"));
// export router
module.exports= router;
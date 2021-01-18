// Import libraries
const express = require("express");
// Import files and variables
const dbConnect = require("./config/db");
const user = require("./routes/api/user");
const task = require("./routes/api/task")
const house = require("./routes/api/house");
const tenant = require("./routes/api/tenant");;
// Define variables
const app = express();
const port = process.env.PORT || 5000;
// Define Middleware
app.use("/api/user", user);
app.use("/api/tenant", tenant);
app.use("/api/task", task);
app.use("/api/house", house);
// Define functions
  // Run database
  dbConnect();
// Create routes
  // GREETING MESSAGE
  app.get("/", (req, res)=>{
    res.send("This is SUVIMIS");
  })
  
// Listen on port 5000
app.listen(port, ()=>{
  console.log(`SUVIMIS API running on port ${port}`)
})

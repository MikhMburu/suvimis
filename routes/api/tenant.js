// Import libraries
const express = require("express");
const passport = require("passport");
// Import Files and variables
require("../../config/passport")(passport);
const Tenant = require("../../models/Person");
const House = require("../../models/House");
const validateCheckInForm = require("../../validation/check-in");
const isEmpty = require("../../validation/isEmpty");
// Define variables
const router = express.Router();
// Define functions
// Create routes
// @route:   GET:/api/tenant/test
// @desc:    Tests the tenant route
// @access:  public
router.get("/test", (req, res) => res.send("Tenant router working perfectly"));
// @route:   POST: /api/tenant/check-in
// @desc:    Check in a new tenant
// @access:  private
router.post(
  "/new-tenant",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Validate tenant data
    const { errors, isValid } = validateCheckInForm(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    // Create new tenant object from req.body
    const tenantObj = {};
    !isEmpty(req.body.t_name) ? (tenantObj.fullName = req.body.t_name) : "";
    !isEmpty(req.body.natID) ? (tenantObj.natID = req.body.natID) : "";
    !isEmpty(req.body.t_email) ? (tenantObj.email = req.body.t_email) : "";
    !isEmpty(req.body.t_phoneno)
      ? (tenantObj.phoneNumber = req.body.t_phoneno)
      : "";
    !isEmpty(req.body.gender) ? (tenantObj.gender = req.body.gender) : "";
    !isEmpty(req.body.designation)
      ? (tenantObj.designation = req.body.designation)
      : "";
    tenantObj.next_of_kin = {};

    !isEmpty(req.body.k_name)
      ? (tenantObj.next_of_kin.fullName = req.body.k_name)
      : "";
    !isEmpty(req.body.k_email)
      ? (tenantObj.next_of_kin.email = req.body.k_email)
      : "";
    !isEmpty(req.body.k_phoneno)
      ? (tenantObj.next_of_kin.phoneNumber = req.body.k_phoneno)
      : "";
    !isEmpty(req.body.relation)
      ? (tenantObj.next_of_kin.relation = req.body.relation)
      : "";
    !isEmpty(req.body.bank) ? (tenantObj.bank = req.body.bank) : "";
    !isEmpty(req.body.acc_no) ? (tenantObj.acc_no = req.body.acc_no) : "";
    !isEmpty(req.body.password) ? (tenantObj.password = req.body.password) : "";

    const newTenant = new Tenant(tenantObj);

    try {
      await newTenant.save();
      res.json({ msg: "New tenant added" });
    } catch (err) {
      res.status(400).json({ error: "The record could not be saved" });
    }
  }
);

// @route:   GET: /api/tenant/
// @desc:    Display all tenants
// @access:  private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const tenants = await Tenant.find({ designation: "Tenant" });
      if (!tenants) {
        return res.json({ noTenant: "No tenants in your database.." });
      }
      res.json(tenants);
    } catch (err) {
      // res.status(400).json({error: "Internal server error"});
      console.log(err);
    }
  }
);

// @route:   GET: /api/tenant/:natID
// @desc:    Display one tenant
// @access:  private
router.get(
  "/:natID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const tenant = await Tenant.findOne({
        natID: req.params.natID,
        designation: "Tenant",
      });
      if (!tenant)
        return res
          .status(404)
          .json({ noTenant: "Tenant with that National ID not found" });
      res.json(tenant);
    } catch (err) {
      res.status(400).json({ error: "Something went wrong..." });
      console.log(err);
    }
  }
);

// export router
module.exports = router;

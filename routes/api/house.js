// Import libraries
const express = require("express");
const passport = require("passport");
// Import Files and variables
const House = require("../../models/House");
const Tenant = require("../../models/Person");
const isEmpty = require("../../validation/isEmpty");
// Define variables
const router = express.Router();
// Define functions
// Create routes
// @route:   GET: /api/house/test
// @desc:    Tests the tenant route
// @access:  public
router.get("/test", (req, res) => res.send("House router working perfectly"));

// @route:   POST: /api/house/add-house
// @desc:    Add a house
// @access:  private
router.post(
  "/add-house",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { hseNo, token_mtr_no } = req.body;
    try {
      if (!isEmpty(hseNo) && !isEmpty(token_mtr_no)) {
        const newHse = new House({
          hseNo,
          token_mtr_no,
        });
        const result = await newHse.save();
        return res.send("Success. New house added");
      }
      return res.status(400).send("Error. One or more fields are empty");
    } catch (err) {
      res
        .status(400)
        .send("Error: Something went wrong and the record could not be added");
      console.log(err);
    }
  }
);

// @route:   POST: /api/house/check-in
// @desc:    Check in a new tenant
// @access:  private
router.post(
  "/check-in",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const newOccupant = {};
    newOccupant.tenant = req.body.tenant;
    newOccupant.date_of_entry = req.body.date_of_entry;
    newOccupant.rent_amt = req.body.rent_amt;
    // Get house to check into
    try {
      const house = await House.findOne({ hseNo: req.body.hseNo });
      if (!house) {
        return res.status(404).json({ nohouse: "House does not exist yet" });
      }
      house.current_occupant = req.body.tenant;
      house.occupants.unshift(newOccupant);
      await house.save();
      res.json({ success: `New tenant checked into house ${house.hseNo}` });
    } catch (err) {
      res.status(400).json({ error: "New tenant could not be checked in." });
      console.log(err);
    }
  }
);

// @route:   POST: /api/house/check-out
// @desc:    Check out a tenant
// @access:  private
router.post(
  "/check-out",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Updating the occupants object in house document
    const { date_of_exit, damages, current_occupant } = req.body;
    try {
      let house = await House.findOne({ current_occupant });
      let occupant;
      occ_index = house.occupants
        .map((occupant) => occupant.tenant)
        .indexOf(current_occupant);

      occupant = house.occupants[occ_index];
      // Edit occupant
      occupant.date_of_exit = date_of_exit;
      occupant.damages = damages;
      house.current_occupant = null;
      // Save house object
      const result = await house.save();
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: "Unable to check out tenant" });
      console.log(err);
    }
  }
);

// @route:   GET: /api/house/
// @desc:    Get all houses
// @access:  private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const units = await House.find();
      if (!units) {
        return res
          .status(404)
          .json({ nohouse: "No units entered into database" });
      }
      res.json(units);
    } catch (err) {
      res.status(400).send("An error 400 happened. Please check console");
      console.log(err);
    }
  }
);

// @route:   GET: /api/house/:id
// @desc:    Get one houses
// @access:  private
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const house = await House.findById(req.params.id).populate({
        path: "persons",
      });
      if (!house)
        return res
          .status(404)
          .json({ nohouse: "No house with that ID present." });
      res.json(house);
    } catch (err) {
      res
        .status(400)
        .send(
          "An internal server error. Please check the console for more details"
        );
    }
  }
);
// export router
module.exports = router;

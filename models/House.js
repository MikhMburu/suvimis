// Import libraries
const mongoose = require("mongoose");
// Import files and/or variables
// Define variables
const { Schema } = mongoose;
// Create schema
const houseSchema = new Schema({
  hseNo: {
    type: String,
    required: true,
  },
  token_mtr_no: {
    type: String,
  },
  current_occupant: {
    type: String,
    default: "",
  },
  occupants: [
    {
      tenant: {
        type: Schema.Types.ObjectId,
        ref: "persons",
      },
      current: {
        type: Boolean,
        default: false,
      },
      date_of_entry: {
        type: Date,
        required: true,
        default: Date.now(),
      },
      date_of_exit: {
        type: Date,
      },
      rent_amt: {
        type: Number,
        required: true,
      },
      damages: {
        type: Number,
        default: 0,
      },
    },
  ],
  meter_readings: [
    {
      date_of_reading: {
        type: Date,
        default: Date.now,
        required: true,
      },
      reading: {
        type: Number,
        required: true,
      },
    },
  ],
});

// Export model
module.exports = House = mongoose.model("house", houseSchema);

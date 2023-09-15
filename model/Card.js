const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cardSchema = new Schema({
  image: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  Specialty: {
    type: String,
    required: true,
  },
  AgeGroup: {
    type: String,
    required: true,
  },
  HostingHospital: {
    type: String,
    required: true,
  },
  OriginHospital: {
    type: String,
    required: true,
  },
  VisitDate: {
    type: Date,
    required: false,
  },
  LeaveDate: {
    type: Date,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
  visibility: {
    type: Boolean,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Card", cardSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cardSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },

  link: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

  type: {
    type: String,
    required: true,
  },
  apply: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Card", cardSchema);

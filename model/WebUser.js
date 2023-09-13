const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WebUserSchema = new Schema({
  username: String,
  fullName: String,
  email: String,
  gender: String,
  country: String,
  phone: String,
  password: String,

  // uni: String,
  // associations: String,
  // yearsOfStudy: String,
  // delegate: String,
  // gradYear: Number,
  // iadsEmployed: String,
  // iadsMember: String,
  // iadsPosition: String,
  // iadsEmail: String,

  validation: Boolean,
  editor: Boolean,
  admin: Boolean,
});
//

//vendor: { type: mongoose.Types.ObjectId, ref: "Vendor" },

module.exports = mongoose.model("WebUser", WebUserSchema);

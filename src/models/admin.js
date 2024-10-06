const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    emailId: { type: String },
    age: { type: Number },
    password: { type: String },
    gender: { type: String },
  },
  { timestamps: true }
);

const Admin = mongoose.model("AdminTest", adminSchema);

module.exports = Admin;

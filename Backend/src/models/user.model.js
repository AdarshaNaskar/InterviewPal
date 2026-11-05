const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, "Username already exist"],
    required: true,
  },
  email: {
    type: String,
    unique: [true, "Account already exits with this email"],
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;

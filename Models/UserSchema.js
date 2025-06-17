const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
    },
    profilePicture: {
      type: String,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address."],
    },
    address: {
      type: String,
    },
    pincode: {
      type: String,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String, 
      enum: ['user', 'admin'], 
      default: 'user'
    },
    verified: {
      type: Boolean,
    },
    otp: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);

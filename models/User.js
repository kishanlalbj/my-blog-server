const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  avatar: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
  createdOn: {
    type: Date,
    default: Date.now(),
  },
});

const User = mongoose.model("user", UserSchema);

module.exports = User;

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  _id: {
    type: String,
    required: true,
  },
  googleTokens: {
    type: Object,
    required: false,
  },
  emailAddress: {
    type: String,
    required: true,
  },
  photoUrl: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false,
  },
  isTeacher: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);

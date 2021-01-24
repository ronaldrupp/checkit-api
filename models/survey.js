const mongoose = require("mongoose");

const surveysSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  teacherId: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  courseId: {
    type: String,
    required: true,
  },
  isMultipleChoice: {
    type: Boolean,
    required: true,
  },
  questions: {
    type: Array,
    required: true,
  },
  answers: {
    type: Array,
    required: false,
  },
});

module.exports = mongoose.model("Survey", surveysSchema);

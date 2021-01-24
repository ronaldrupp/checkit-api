const mongoose = require("mongoose");

const surveysSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  createdAt: {
    type: String,
    required: false,
  },
  teacherId: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  courseId: {
    type: String,
    required: false,
  },
  teacherPhotoUrl: {
    type: String,
    required: false,
  },
  teacherName: {
    type: String,
    required: false,
  },
  isMultipleChoice: {
    type: Boolean,
    required: false,
  },
  questions: {
    type: Array,
    required: false,
  },
  answers: {
    type: Array,
    required: false,
  },
});

module.exports = mongoose.model("Survey", surveysSchema);

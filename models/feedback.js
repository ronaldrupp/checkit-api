const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    required: false,
  },
  teacherId: {
    type: String,
    required: false,
  },
  courseId: { type: String, required: true },
  students: { type: Array, required: true, default: [] },
  description: {
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
});

module.exports = mongoose.model("Feedback", FeedbackSchema);

const mongoose = require("mongoose");

const FeedbackDraftsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    required: false,
  },
  updatedAt: { type: Date, required: false },
  teacherId: {
    type: String,
    required: false,
  },
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

module.exports = mongoose.model("FeedbackDrafts", FeedbackDraftsSchema);

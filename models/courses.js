const mongoose = require("mongoose");

const coursesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  _id: {
    type: String,
    required: true,
  },
  linkToGClassroomCourse: {
    type: String,
    required: true,
  },
  courseState: {
    type: String,
    required: true,
  },
  teacherId: {
    type: String,
    required: true,
  },
  students: {
    type: Array,
    required: true,
  }
});

module.exports = mongoose.model("Course", coursesSchema);

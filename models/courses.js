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
  descriptionHeading: {
    type: String,
    required: false
  },
  linkToGClassroomCourse: {
    type: String,
    required: true,
  },
  courseState: {
    type: String,
    required: true,
  },
  teachers: {
    type: Array,
    required: true,
  },
  teacherPhotoUrl: {
    type: String,
    required: false,
  },
  students: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model("Course", coursesSchema);

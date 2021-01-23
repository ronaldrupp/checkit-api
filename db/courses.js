const Courses = require("../models/courses");

async function getCourses(userId) {
  const courses = await Courses.find({ teacherId: userId });
  return courses;
}

async function createCourse(teacher, course) {
  const resFromDB = {};
  let newCourse = new Courses({
    name: course.name,
    _id: course.id,
    linkToGClassroomCourse: course.alternateLink,
    courseState: course.courseState,
    teacherId: teacher,
    students: course.students,
  });
  try {
    resFromDB = await newCourse.save();
    "created course" + resFromDB;
    return resFromDB;
  } catch (err) {
    return err;
  }
}

module.exports = {
  getCourses,
  createCourse,
};

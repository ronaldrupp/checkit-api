const Courses = require("../models/courses");

async function getCourses(user) {
  if (user.isTeacher) return await Courses.find({ teacherId: user._id });
  else return await Courses.find({ "students.userId": user._id });
}

async function getCourse(user, courseId) {
  return await Courses.find({ _id: courseId });
}

async function createCourse(teacher, course) {
  let newCourse = new Courses({
    name: course.name,
    _id: course.id,
    linkToGClassroomCourse: course.alternateLink,
    courseState: course.courseState,
    teacherId: teacher,
    teacherPhotoUrl: course.teacherPhotoUrl,
    students: course.students,
    descriptionHeading: course.descriptionHeading,
  });
  try {
    return await newCourse.save();
  } catch (err) {
    return err;
  }
}

async function checkIfUserIsInCourse(userId, courseId) {
  const course = await Courses.findById(courseId);
  const foundUser = course.students.find((elm) => elm.userId == userId);
  if (foundUser || course.teacherId == userId) return true;
  else return false;
}

module.exports = {
  getCourse,
  getCourses,
  createCourse,
  checkIfUserIsInCourse,
};

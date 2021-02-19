const Courses = require("../models/courses");
const User = require("../models/user");

//GETS ALL COURSES FROM DB
async function getCourses(user) {
  if (user.isTeacher) {
    teacher = await User.findById(user._id);
    let resFromDB = await Courses.find({ teachers: user._id });
    let teachersList = [];
    for (let course of resFromDB) {
      for (const teacher of course.teachers) {
        teachersList.push(await User.findById(teacher));
      }
      course.teachers = teachersList;
    }

    let studentsList = [];
    for (let course of resFromDB) {
      for (const student of course.students) {
        studentsList.push(await User.findById(student));
      }
      course.students = studentsList;
    }
    return resFromDB;
  } else {
    let resFromDB = await Courses.find({ students: user._id });
    let teachersList = [];
    for (let course of resFromDB) {
      for (const teacher of course.teachers) {
        teachersList.push(await User.findById(teacher));
      }
      course.teachers = teachersList;
    }

    let studentsList = [];
    for (let course of resFromDB) {
      for (const student of course.students) {
        studentsList.push(await User.findById(student));
      }
      course.students = studentsList;
    }
    return resFromDB;
  }
}

//GETS ONE COURSE FROM DB
async function getCourse(user, courseId) {
  //gets course from DB
  let resFromDB = await Courses.find({ _id: courseId });
  //searches for user in course
  resFromDB = resFromDB[0];
  const studentIsAllowed = resFromDB.students.find(
    (student) => student == user._id
  );
  const teacherIsAllowed = resFromDB.teachers.find(
    (teacher) => teacher == user._id
  );
  let teachersList = [];
  for (let teacher of resFromDB.teachers) {
    teachersList.push(await User.findById(teacher));
  }
  console.log(teachersList);

  let studentsList = [];
  for (let student of resFromDB.students) {
    studentsList.push(await User.findById(student));
  }
  if (studentIsAllowed || teacherIsAllowed)
    return {
      ...resFromDB.toObject(),
      teachers: teachersList,
      students: studentsList,
    };
  else return "Forbidden";
}

async function createCourse(teachers, course) {
  let newCourse = new Courses({
    name: course.name,
    _id: course.id,
    linkToGClassroomCourse: course.alternateLink,
    courseState: course.courseState,
    teachers: course.teachers,
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

var express = require("express");
var router = express.Router();
const { authenticateToken, createNewUser } = require("./auth");
const { getCourses, createCourse, getCourse } = require("./../db/courses");
const { oauth2Client } = require("./googleClassroom");
const User = require("../models/user");
const google = require("googleapis").google;
const OAuth2 = google.auth.OAuth2;

/* GET all courses from DB */
router.get("/courses", authenticateToken, async function (req, res) {
  res.send(await getCourses(req.user));
});

/* GET one course from DB */
router.get("/course/:courseId", authenticateToken, async function (req, res) {
  res.send(await getCourse(req.user, req.params.courseId));
});

/* POST save Course on DB */
router.post("/course", authenticateToken, async function (req, res) {
  //getting Google Token from DB
  const userFromDB = await User.findById(req.user._id);
  oauth2Client.credentials = userFromDB.googleTokens;

  //getting students from that course from Google Classroom
  const classroom = google.classroom({ version: "v1", auth: oauth2Client });
  const resFromG = await classroom.courses.students.list({
    courseId: req.body.id,
  });
  const students = resFromG.data.students;
  students.forEach((student) => {
    createNewUser(student.profile, undefined);
  });
  //creating course on DB and sending result back to client
  res.send(
    await createCourse(req.user._id, {
      ...req.body,
      teacherPhotoUrl: req.user.photoUrl,
      students,
    })
  );
});

module.exports = router;

var express = require("express");
var router = express.Router();
const { authenticateToken, createNewUser } = require("./auth");
const { getCourses, createCourse } = require("./../db/courses");
const { oauth2Client } = require("./googleClassroom");
const User = require("../models/user");
const google = require("googleapis").google;
const OAuth2 = google.auth.OAuth2;

/* GET all Courses from DB */
router.get("/courses", authenticateToken, async function (req, res) {
  res.send(await getCourses(req.user._id));
});

/* POST save Course on DB */
router.post("/course", authenticateToken, async function (req, res) {
  //getting Google Token from DB
  "UserID" + req.user._id;
  const userFromDB = await User.findById(req.user._id);
  "UserFromDB" + userFromDB;
  oauth2Client.credentials = userFromDB.googleTokens;

  //getting students from that course from Google Classroom
  const classroom = google.classroom({ version: "v1", auth: oauth2Client });
  const resFromG = await classroom.courses.students.list({
    courseId: req.body.id,
  });
  const students = resFromG.data.students;
  students;
  students.forEach((student) => {
    createNewUser(student.profile, undefined);
  });
  //creating course on DB and sending result back to client
  res.send(
    await createCourse(req.user._id, {
      ...req.body,
      students,
    })
  );
});

module.exports = router;

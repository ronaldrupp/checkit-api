var express = require("express");
var router = express.Router();

const {
  getSurvey,
  createSurvey,
  getSurveys,
  answerSurvey,
} = require("./../db/surveys");
const { authenticateToken, createNewUser } = require("./auth");
const { postOnClassroom } = require("./googleClassroom");
const { getCourses, createCourse, getCourse } = require("./../db/courses");
const { oauth2Client } = require("./googleClassroom");
const User = require("../models/user");
const google = require("googleapis").google;
const OAuth2 = google.auth.OAuth2;

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
  if (students) {
    students.forEach((student) => {
      createNewUser(student.profile, undefined);
    });
  }
  //creating course on DB and sending result back to client
  res.send(
    await createCourse(req.user._id, {
      ...req.body,
      teacherPhotoUrl: req.user.photoUrl,
      students,
    })
  );
});

/* POST survey */
router.post("/survey", authenticateToken, async function (req, res) {
  const resFromDB = await createSurvey(req.user, req.body);
  console.log(await postOnClassroom(req.user, resFromDB));
  res.send(resFromDB);
});

module.exports = router;

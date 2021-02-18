var express = require("express");
var router = express.Router();

const {
  getSurvey,
  getFeedbackDrafts,
  getFeedbackDraft,
  updateFeedbackDraft,
  createFeedbackDraft,
  deleteFeedbackDraft,
} = require("./../db/surveys");
const { createSurvey } = require("./../db/feedback");
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

// GETS ALL FEEDBACK DRAFTS FROM ONE TEACHER
router.get("/feedbackdrafts", authenticateToken, async function (req, res) {
  res.send(await getFeedbackDrafts(req.user));
});

//GETS ONE FEEDBACK DRAFT FROM TEACHER
router.get("/feedbackdraft/:id", authenticateToken, async function (req, res) {
  res.send(await getFeedbackDraft(req.user, req.params.id));
});

//UPDATES ONE FEEDBACK DRAFT FROM TEACHER
router.put("/feedbackdraft", authenticateToken, async function (req, res) {
  res.json(await updateFeedbackDraft(req.user, req.body));
});

//CREATES ONE FEEDBACK DRAFT FROM TEACHER
router.post("/feedbackdraft", authenticateToken, async function (req, res) {
  res.json(await createFeedbackDraft(req.user, req.body));
});

//DELETES ONE FEEDBACK DRAFT FROM TEACHER
router.delete("/feedbackdraft/:id", authenticateToken, async function (req, res) {
  res.send(await deleteFeedbackDraft(req.user, req.params.id));
});

/* POST FEEDBACK */
router.post("/survey", authenticateToken, async function (req, res) {
  const resFromDB = await createSurvey(req.user, req.body);
  await postOnClassroom(req.user, resFromDB);
  res.send(resFromDB);
});

router.get("/survey/:id", authenticateToken, async function (req, res) {});

module.exports = router;

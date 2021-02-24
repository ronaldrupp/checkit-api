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

  const resFromG2 = await classroom.courses.teachers.list({
    courseId: req.body.id,
  });
  const teachers = resFromG2.data.teachers;

  let createdCourse = await createCourse(req.user._id, {
    ...req.body,
    students: students.map((student) => student.userId),
    teachers: teachers.map((teacher) => teacher.userId),
  });

  if (teachers) {
    teachers.forEach(async (teacher) => {
      let teacherFromDB = await User.findById(teacher.userId).exec();
      if (teacherFromDB != null) {
        let user = await User.findById(teacherFromDB._id);
        user.courses = [...teacherFromDB.courses, createdCourse._id];
        user.save();
      } else createNewUser(createdCourse._id, teacher.profile, undefined);
    });
  }
  if (students) {
    students.forEach(async (student) => {
      const studentFromDB = await User.findById(student.userId).exec();
      if (studentFromDB != null) {
        let user = await User.findById(studentFromDB._id);
        user.courses = [...studentFromDB.courses, createdCourse._id];
        user.save();
      } else createNewUser(createdCourse._id, student.profile, undefined);
    });
  }

  res.send("OK");
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
router.delete(
  "/feedbackdraft/:id",
  authenticateToken,
  async function (req, res) {
    res.send(await deleteFeedbackDraft(req.user, req.params.id));
  }
);

/* POST FEEDBACK */
router.post("/survey", authenticateToken, async function (req, res) {
  const resFromDB = await createSurvey(req.user, req.body);
  await postOnClassroom(req.user, resFromDB);
  res.send(resFromDB);
});

router.get("/survey/:id", authenticateToken, async function (req, res) {});

module.exports = router;

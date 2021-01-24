var express = require("express");
var router = express.Router();

const { authenticateToken } = require("./auth");
const {
  getSurvey,
  createSurvey,
  getSurveys,
  answerSurvey,
} = require("./../db/surveys");
const { checkIfUserIsInCourse } = require("./../db/courses");
const { postOnClassroom } = require("./googleClassroom");

/* GET specific survey with an id */
router.get(
  "/survey/:courseId/:id",
  authenticateToken,
  async function (req, res) {
    const userIsAthorized = await checkIfUserIsInCourse(
      req.user._id,
      req.params.courseId
    );
    if (userIsAthorized) {
      res.send(await getSurvey(req.params.id));
    } else res.status(403).send("Not Authorized");
  }
);

router.get("/surveys/:courseId", authenticateToken, async function (req, res) {
  res.send(await getSurveys(req.params.courseId));
});

/* POST survey */
router.post("/survey", authenticateToken, async function (req, res) {
  const resFromDB = await createSurvey(req.user, req.body);
  console.log(await postOnClassroom(req.user, resFromDB));

  res.send(resFromDB);
});

/* POST survey */
router.post("/answerSurvey", authenticateToken, async function (req, res) {
  res.send(await answerSurvey(req.user, req.body));
});

module.exports = router;

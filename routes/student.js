var express = require("express");
var router = express.Router();
const { getFeedback, answerFeedback } = require("./../db/feedback");
const { checkIfUserIsInCourse } = require("./../db/courses");

const { authenticateToken, createNewUser } = require("./auth");

//GET SPECIFIC SURVEY FORM A COURSE
router.get(
  "/survey/:courseId/:id",
  authenticateToken,
  async function (req, res) {
    res.send(await getFeedback(req.user, req.params.id));
  }
);

/* POST survey */
router.post("/answerSurvey", authenticateToken, async function (req, res) {
  res.send(await answerFeedback(req.user, req.body));
});

module.exports = router;

var express = require("express");
var router = express.Router();

const { authenticateToken, createNewUser } = require("./auth");
const {
  getSurvey,
  createSurvey,
  getSurveys,
  answerSurvey,
} = require("./../db/surveys");

/* POST survey */
router.post("/answerSurvey", authenticateToken, async function (req, res) {
  res.send(await answerSurvey(req.user, req.body));
});

module.exports = router;
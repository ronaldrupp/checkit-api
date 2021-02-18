var express = require("express");
var router = express.Router();

const { authenticateToken } = require("./auth");
const { getFeedbacks, getFeedbackDetail } = require("./../db/feedback");

//GET ALL SURVEYS FROM ONE COURSE
router.get("/surveys/:courseId", authenticateToken, async function (req, res) {
  res.send(await getFeedbacks(req.user, req.params.courseId));
});

router.get("/surveydetail/:id", authenticateToken, async function (req, res) {
  res.send(await getFeedbackDetail(req.user._id, req.params.id));
});

module.exports = router;

var express = require("express");
var router = express.Router();
const { authenticateToken } = require("./auth");
const { getCourses, createCourse, getCourse } = require("./../db/courses");
const User = require("../models/user");

/* GET all courses from DB */
router.get("/courses", authenticateToken, async function (req, res) {
  res.send(await getCourses(req.user));
});

/* GET one course from DB */
router.get("/course/:courseId", authenticateToken, async function (req, res) {
  res.send(await getCourse(req.user, req.params.courseId));
});



module.exports = router;

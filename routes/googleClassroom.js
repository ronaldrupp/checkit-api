var express = require("express");
var router = express.Router();
const CONFIG = require("../config");
const jwt = require("jsonwebtoken");
const google = require("googleapis").google;
const OAuth2 = google.auth.OAuth2;
const User = require("../models/user");
const { authenticateToken } = require("./auth");

const oauth2Client = new OAuth2(
  CONFIG.oauth2Credentials.client_id,
  CONFIG.oauth2Credentials.client_secret,
  CONFIG.oauth2Credentials.redirect_uris[0]
);

router.get("/allCourses", authenticateToken, async function (req, res) {
  const oauth2Client = new OAuth2(
    CONFIG.oauth2Credentials.client_id,
    CONFIG.oauth2Credentials.client_secret,
    CONFIG.oauth2Credentials.redirect_uris[0]
  );
  const userFromDB = await User.findById(req.user._id);
  oauth2Client.credentials = userFromDB.googleTokens;
  const classroom = google.classroom({ version: "v1", auth: oauth2Client });
  res.send(
    await classroom.courses.list({}).then((res, err) => {
      if (err) return err;
      return res.data.courses;
    })
  );
});

async function postOnClassroom(user, survey) {
  const userFromDB = await User.findById(user._id);
  oauth2Client.credentials = userFromDB.googleTokens;
  const classroom = google.classroom({ version: "v1", auth: oauth2Client });

  return await classroom.courses.announcements.create({
    courseId: survey.courseId,
    requestBody: {
      text: `Take a minute and give me feedback with Check-It \n\n${process.env.DOMAIN}/feedback/${survey.courseId}/${survey._id}`,
    },
  });
}

module.exports = { router, oauth2Client, postOnClassroom };

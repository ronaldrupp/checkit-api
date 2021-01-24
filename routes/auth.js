var express = require("express");
var router = express.Router();
const google = require("googleapis").google;
const OAuth2 = google.auth.OAuth2;
const CONFIG = require("../config");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const oauth2Client = new OAuth2(
  CONFIG.oauth2Credentials.client_id,
  CONFIG.oauth2Credentials.client_secret,
  CONFIG.oauth2Credentials.redirect_uris[0]
);

const User = require("../models/user");
let refreshTokens = [];

router.post("/google/token", async function (req, res) {
  const gTokens = await oauth2Client.getToken(req.body.authCode);
  const client = new OAuth2Client(CONFIG.client_id);
  const ticket = await client.verifyIdToken({
    idToken: gTokens.tokens.id_token,
    audience:
      "10275853460-f457s1rj15u25f4lj0irtnt701187acv.apps.googleusercontent.com",
  });
  const payload = ticket.getPayload();
  oauth2Client.credentials = gTokens.tokens;
  const classroom = google.classroom({ version: "v1", auth: oauth2Client });
  const resultFromG = await classroom.userProfiles.get({
    userId: payload.sub,
  });
  const isTeacher = resultFromG.data.verifiedTeacher;
  const foundUser = await User.findById(payload.sub).exec();
  console.log("looking up for user on db");
  if (foundUser != null) {
    res.json(handleJWT(foundUser));
  } else {
    console.log("user not found on db");
    const resultFromCreating = await createNewUser(
      { ...resultFromG.data, isTeacher },
      gTokens.tokens
    );
    res.json(handleJWT(resultFromCreating));
  }
});

function handleJWT(user) {
  console.log("creating JWTs");
  const accessToken = jwt.sign(
    JSON.stringify(user),
    process.env.ACCESS_TOKEN_SECRET
  );
  const refreshToken = jwt.sign(
    JSON.stringify(user),
    process.env.REFRESH_TOKEN_SECRET
  );
  refreshTokens.push(refreshToken);
  console.log("DONE creating JWTs");
  return { accessToken, refreshToken, user };
}
async function createNewUser(userInfo, googleTokens) {
  console.log("creating User on DB");
  let user = new User({
    name: userInfo.name.fullName,
    emailAddress: userInfo.emailAddress,
    _id: userInfo.id,
    photoUrl: userInfo.photoUrl,
    googleTokens: googleTokens ? googleTokens : null,
    isTeacher: userInfo.isTeacher ? true : false,
  });
  try {
    console.log("DONE creating User on DB");
    return await user.save();
  } catch (err) {
    return err;
  }
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(402);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    user;
    req.user = user;
    next();
  });
}

function findUser(userId) {
  try {
    return User.findById(userId);
  } catch (err) {
    return err;
  }
}

module.exports = { router, authenticateToken, createNewUser, findUser };

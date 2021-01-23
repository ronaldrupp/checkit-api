var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
const User = require("../models/user");

require("dotenv").config();

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => "Connected to Database");

const posts = [
  {
    title: "Post1",
    username: "obama",
  },
  {
    title: "Post2",
    username: "obama",
  },
];

let refreshTokens = [];

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("you reached / :D");
});

router.get("/token", function (req, res, next) {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken });
  });
});

router.delete("/logout", function (req, res, next) {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

router.post("/login", async function (req, res, next) {
  const username = req.body.username;
  const user = { name: username };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  res.json({ accessToken, refreshToken });
});

router.post("/register", async function (req, res, next) {
  let user = new User({
    username: req.body.username,
    password: await bcrypt.hash(req.body.password, 10),
  });
  try {
    const newUser = await user.save();
    // res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
  const accessToken = jwt.sign(
    { name: req.body.username },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
  const refreshToken = jwt.sign(
    req.body.username,
    process.env.REFRESH_TOKEN_SECRET
  );
  refreshTokens.push(refreshToken);
  res.json({ accessToken, refreshToken });
});

module.exports = router;

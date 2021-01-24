var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

var { router: auhtRouter } = require("./routes/auth");
var { router: googleClassroomRouter } = require("./routes/googleClassroom");
var coursesRouter = require("./routes/courses");
var surveyRouter = require("./routes/surveys");

//Connection to Database
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

var app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", googleClassroomRouter);
app.use("/", auhtRouter);
app.use("/", coursesRouter);
app.use("/", surveyRouter);

module.exports = app;

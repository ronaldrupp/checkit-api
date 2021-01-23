var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/index");
var { router: auhtRouter } = require("./routes/auth");
var usersRouter = require("./routes/users");
var { router: googleClassroomRouter } = require("./routes/googleClassroom");
var coursesRouter = require("./routes/courses");

var app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/", googleClassroomRouter);
app.use("/", auhtRouter);
app.use("/", coursesRouter);
app.use("/users", usersRouter);

module.exports = app;

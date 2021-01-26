const Surveys = require("../models/survey");
const { findUser } = require("../routes/auth");

async function getSurveys(courseId) {
  return await Surveys.find({ courseId: courseId });
}

//get survey in order to answer it
async function getSurvey(user, surveyId) {
  const foundSurvey = await Surveys.findById(surveyId);
  console.log(foundSurvey)
  //checking if user has already answered survey
  const hasAnswered = foundSurvey.answers.find((elm) => elm.userId == user._id);
  console.log(hasAnswered)
  if (hasAnswered) {
    return { error: "User has already answered survey" };
  } else return foundSurvey
}

async function createSurvey(user, survey) {
  let newSurvey = new Surveys({
    name: survey.name,
    description: survey.description,
    createdAt: survey.createdAt,
    isMultipleChoice: survey.isMultipleChoice,
    questions: survey.questions,
    teacherId: user._id,
    teacherName: user.name,
    teacherPhotoUrl: user.photoUrl,
    courseId: survey.courseId,
  });
  try {
    return await newSurvey.save();
  } catch (err) {
    return err;
  }
}

//answer Survey
async function answerSurvey(user, body) {
  //TODO CHECK IF USER HAS ALREADY ANSWERED FEEDBACK
  const foundUser = findUser(user._id);
  if (foundUser) {
    console.log(body);
    let foundSurvey = await Surveys.findById(body.surveyId);
    foundSurvey.answers.push({ userId: user._id, answers: body.answers });
    try {
      return foundSurvey.save();
    } catch (err) {
      return err;
    }
  } else return "NOT AUTHORIZED";
}

module.exports = {
  createSurvey,
  getSurvey,
  answerSurvey,
  getSurveys,
};

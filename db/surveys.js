const Surveys = require("../models/survey");
const { findUser } = require("../routes/auth");

async function getSurveys(courseId) {
  return await Surveys.find({ courseId: courseId });
}

async function getSurvey(surveyId) {
  return await Surveys.findById(surveyId);
}

async function createSurvey(user, survey) {
  let newSurvey = new Surveys({
    name: survey.name,
    description: survey.description,
    createdAt: survey.createdAt,
    isMultipleChoice: survey.isMultipleChoice,
    questions: survey.questions,
    teacherId: user._id,
    courseId: survey.courseId,
  });
  try {
    return await newSurvey.save();
  } catch (err) {
    return err;
  }
}

async function answerSurvey(user, answer) {
  const foundUser = findUser(user._id);
  if (foundUser) {
    let survey = new Surveys();
    survey.answers.push(answer);
    try {
      return survey.save();
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

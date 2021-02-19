const Feedback = require("../models/feedback");
const { checkIfUserIsInCourse } = require("./courses");
const User = require("../models/user");

//CREATES A SURVEY ON DATABASE
async function createSurvey(user, survey) {
  let newSurvey = new Feedback({
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

//GETS ALL FEEDBACKS OF A COURSE
async function getFeedbacks(user, courseId) {
  return await Feedback.find({ courseId });
}

//GETS ONE FEEDBACK OF A COURSE
async function getFeedback(user, _id) {
  let foundFeedback = await Feedback.findById(_id);
  foundFeedback = foundFeedback.toObject();
  const foundTeacher = await User.findById(foundFeedback.teacherId);
  const userIsAllowed = checkIfUserIsInCourse(user._id, foundFeedback.courseId);
  //check if student has already answered feedback
  const foundUser = foundFeedback.students.find(
    (student) => student.userId == user._id
  );
  if (!foundUser && userIsAllowed)
    return {
      teacherPhotoUrl: foundTeacher.photoUrl,
      teacherName: foundTeacher.name,
      ...foundFeedback,
    };
  else return "Forbidden";
}

//ANSWERS A FEEDBACK
async function answerFeedback(user, answer) {
  let foundFeedback = await Feedback.findById(answer.surveyId);
  const userIsAllowed = checkIfUserIsInCourse(user._id, foundFeedback.courseId);
  if (userIsAllowed) {
    let tempQuestions = foundFeedback.toObject();

    foundFeedback.students.push({ userId: user._id });

    tempQuestions.questions.forEach((element, index) => {
      element.answers.forEach((elm) => {
        if (elm.choice == answer.answers[index].answer) elm.votes += 1;
      });
    });

    foundFeedback.questions = tempQuestions.questions;
    return await foundFeedback.save();
  } else return 403;
}

//GETS FEEDBACK STATS
async function getFeedbackDetail(userId, feedbackId) {
  const feedback = await Feedback.findById(feedbackId);
  let newArray = feedback.questions.map((elm) => {
    return {
      question: elm.question,
      answer: elm.answers.map((answer) => {
        return {
          option: answer.choice,
          percent: (answer.votes / feedback.students.length).toFixed(2),
          count: answer.votes,
        };
      }),
    };
  });
  return {
    name: feedback.name,
    description: feedback.description,
    createdAt: feedback.createdAt,
    questions: newArray,
  };
}

module.exports = {
  createSurvey,
  answerFeedback,
  getFeedbacks,
  getFeedback,
  getFeedbackDetail,
};

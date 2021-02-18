const Surveys = require("../models/survey");

//CREATES A FEEDBACK DRAFT
async function createFeedbackDraft(user, newFeedback) {
  let newSurvey = new Surveys({
    name: newFeedback.name,
    description: newFeedback.description,
    createdAt: newFeedback.createdAt,
    isMultipleChoice: newFeedback.isMultipleChoice,
    questions: newFeedback.questions,
    teacherId: user._id,
  });
  try {
    return await newSurvey.save();
  } catch (err) {
    return err;
  }
}

// GETS ALL FEEDBACK DRAFTS FROM ONE TEACHER
async function getFeedbackDrafts(user) {
  return await Surveys.find({ teacherId: user._id });
}

//GETS ONE FEEDBACK DRAFT FROM TEACHER
async function getFeedbackDraft(user, feedbackDraftId) {
  return await Surveys.findById(feedbackDraftId);
}

//UPDATES ONE FEEDBACK DRAFT FROM TEACHER
async function updateFeedbackDraft(user, updatedFeedbackDraft) {
  let foundFeedbackDraft = await Surveys.findById(updatedFeedbackDraft._id);
  foundFeedbackDraft.name = updatedFeedbackDraft.name;
  foundFeedbackDraft.description = updatedFeedbackDraft.description;
  foundFeedbackDraft.questions = updatedFeedbackDraft.questions;
  foundFeedbackDraft.updatedAt = new Date();
  try {
    return await foundFeedbackDraft.save();
  } catch (err) {
    return err.message;
  }
}

//DELETES ONE FEEDBACK DRAFT FROM TEACHER
async function deleteFeedbackDraft(user, id) {
  return await Surveys.deleteOne({ _id: id });
}




module.exports = {
  getFeedbackDrafts,
  getFeedbackDraft,
  updateFeedbackDraft,
  createFeedbackDraft,
  deleteFeedbackDraft,
};

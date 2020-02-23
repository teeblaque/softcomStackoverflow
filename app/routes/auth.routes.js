// routes/auth.routes.js
const express = require("express");
const router = express.Router();
const user_controller = require("../controllers/user.controller");
const question_controller = require("../controllers/question.controller");
const authorize = require("../middlewares/auth.middleware");

const { check, validationResult } = require("express-validator");

// Sign-up
router.post('/signup', user_controller.register);

//login
router.post('/login', user_controller.authenticate);

//Get all Users
router.get('/users', user_controller.getUser);

//Get Authenticated user
router.get('/current-user', authorize, user_controller.currentUser);

//Add Question
router.post('/questions/ask', authorize, question_controller.question);

//View All Questions
router.get("/questions", question_controller.viewQuestions);

//View Single Question
router.get("/questions/:questionId/:slug", question_controller.singleQuestion);

//Ans Question
router.post("/create-answer/:questionId", authorize, question_controller.ansQuestions);

//Subscribe to a question
router.post("/subscribe/:questionId", authorize, question_controller.subscribe);

//upvote
router.post("/upvote/:questionId", authorize, question_controller.upvote);

//downvote
router.post("/downvote/:questionId", authorize, question_controller.downvote);

//search questions
router.post("/search-question", question_controller.searchQuestions);

//search answers
router.get("/search-answer/:questionId", question_controller.searchAnswers);

//search a user
router.get("/search-user/:id", user_controller.searchUser);

module.exports = router;

const questionSchema = require("../models/question.model");
const answerSchema = require("../models/answer.model");
const subscriber = require("../models/subscriber.model");
const userSchema = require("../models/user.model");
var slugify = require('slugify');

// Create and Save a new Question
exports.question = (req, res) => {
     // Validate request
    if (!req.body.title) {
        return res.status(400).send({
            message: "Question title can not be empty"
        });
    }

    if (!req.body.content) {
        return res.status(400).send({
            message: "Content cannot be empty"
        })
    }

    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization;
        var part = authorization.split(" ")[1];

        let base64Url = part.split(".")[1]; // token you get
        let base64 = base64Url.replace("-", "+").replace("_", "/");
        let decodedData = JSON.parse(
          Buffer.from(base64, "base64").toString("binary")
        );
            const question = new questionSchema();
            question.user_id = decodedData['userId'];
            question.title = req.body.title;
            question.content = req.body.content;
            question.slug = slugify(req.body.title);
            question
              .save()
              .then(result => {
                return res.json({ message: "Question created!", result });
              })
              .catch(error => {
                res.status(500).json({ error });
              });
    }
};

exports.viewQuestions = (req, res) => {
  questionSchema.find((error, response) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        'message': 'success',
        data: response
      });
    }
  });
};

exports.singleQuestion = (req, res) => {
  questionSchema
    .findById(req.params.questionId)
    .then(note => {
      if (!note) {
        return res.status(404).send({
          message: "Question not found with id " + req.params.questionId
        });
      }
      res.status(200).json({
        message: 'success',
        data: note
      });
    //   res.send(note);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Question not found with id " + req.params.questionId
        });
      }
      return res.status(500).send({
        message: "Error retrieving note with id " + req.params.questionId
      });
    });
};

exports.ansQuestions = (req, res) => {
    // Validate request
    if (!req.body.content) {
      return res.status(400).send({
        message: "Content can not be empty"
      });
    }

    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization;
        var part = authorization.split(" ")[1];

        let base64Url = part.split(".")[1]; // token you get
        let base64 = base64Url.replace("-", "+").replace("_", "/");
        let decodedData = JSON.parse(
          Buffer.from(base64, "base64").toString("binary")
        );

        // Create a Note
    const ans = new answerSchema({
        user_id: decodedData['userId'],
        question_id: req.params.questionId,
        content: req.body.content
    });

    // Save Note in the database
    ans.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while solving the question."
        });
    });

    }
}

exports.subscribe = (req, res) => {

    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization;
        var part = authorization.split(" ")[1];

        let base64Url = part.split(".")[1]; // token you get
        let base64 = base64Url.replace("-", "+").replace("_", "/");
        let decodedData = JSON.parse(
          Buffer.from(base64, "base64").toString("binary")
        );
            // Create a Note
    const subscribe = new subscriber({
        user_id: decodedData["userId"],
        question_id: req.params.questionId
    });

    // Save Note in the database
    subscribe.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while solving the question."
        });
    });
    }
}

exports.upvote = (req, res) => {
    // Find note and update it with the request body
    questionSchema.findByIdAndUpdate(req.params.questionId, {
         $inc: { upvote: 1 } 
    }, { new: true })
        .then(note => {
            if (!note) {
                return res.status(404).send({
                    message: "Question not found with id " + req.params.questionId
                });
            }
            res.send(note);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Question not found with id " + req.params.questionId
                });
            }
            return res.status(500).send({
                message: "Error updating note with id " + req.params.noteId
            });
        });
}

exports.downvote = (req, res) => {
  // Find note and update it with the request body
  questionSchema.findByIdAndUpdate(req.params.questionId, {
    $inc: { upvote: -1 }
  }, { new: true })
    .then(note => {
      if (!note) {
        return res.status(404).send({
          message: "Question not found with id " + req.params.questionId
        });
      }
      res.send(note);
    }).catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "Question not found with id " + req.params.questionId
        });
      }
      return res.status(500).send({
        message: "Error updating note with id " + req.params.noteId
      });
    });
}

exports.searchQuestions = (req, res) => {
    if (!req.body.title) {
      return res.status(400).send({
        message: "Enter a question title to search"
      });
    }
  questionSchema.findOne({ title: req.body.title })
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};

exports.searchAnswers = function(req, res){
    answerSchema
      .findOne({ question_id: req.params.questionId})
      .then(qtn => {
        if (!qtn) {
          return res.status(404).send({
            message: "Answer not found for question selected " + req.params.questionId
          });
        } else {
          res.send(qtn);
        }
      })
      .catch(err => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "Answer not found for question selected" + req.params.questionId
          });
        }
        return res.status(500).send({
          message: "Error retrieving note with id " + req.params.questionId
        });
      });
}
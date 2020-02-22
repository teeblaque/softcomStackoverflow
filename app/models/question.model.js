// models/question.model.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

let questionSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    title: {
      type: String,
      trim: true,
      required: true,
      max: 255,
      min: 6,
      unique: true
    },
    slug: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true,
      max: 1024
    },
    upvote: {
      type: Number,
      required: true,
      default: 0
    }
    // ,
    // answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }], 
  },{
      toJSON: {
        virtuals: true
      }
  },

  {timestamps: true},
  {collection: "questions"},
);

questionSchema.plugin(uniqueValidator, { message: "Question title aready exist" });
module.exports = mongoose.model("Question", questionSchema);

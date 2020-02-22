// models/answer.model.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

let answerSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    question_id: {
      type: Schema.Types.ObjectId,
      ref: "Question"
    },
    content: {
      type: String,
      trim: true,
      required: true,
      max: 1024,
      min: 6,
      unique: true
    }
  },
  {
    toJSON: {
      virtuals: true
    }
  },
  {
    timestamps: true
  },
  {
    collection: "answers"
  }
);

answerSchema.plugin(uniqueValidator, { message: "Same answer already exist" });
module.exports = mongoose.model("Answer", answerSchema);

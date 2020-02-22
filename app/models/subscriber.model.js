// models/answer.model.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let subscriber = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    question_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question"
    }
  },
  {
    timestamps: true
  },
  {
    collection: "subscribers"
  }
);

module.exports = mongoose.model("Subscriber", subscriber);

// models/user.model.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

let userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      max: 255,
      min: 6,
      required: true
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      maxlength: 100,
      unique: true
    },
    password: {
      type: String,
      max: 1024,
      min: 8,
      required: true
    }
    // ,
    // question: [
    //   { type: mongoose.Schema.Types.ObjectId, ref: "Question" }
    // ],
    // answer: [
    //   { type: mongoose.Schema.Types.ObjectId, ref: "Answer"}
    // ],
    // subscribe: [
    //   { type: mongoose.Schema.Types.ObjectId, ref: "Subscribe"}
    // ]
  },
  {
    timestamps: true
  },
  {
    collection: "users"
  }
);

userSchema.plugin(uniqueValidator, { message: "Email already in use." });
module.exports = mongoose.model("User", userSchema);

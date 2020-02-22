const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userSchema = require("../models/user.model");
const { check, validationResult } = require("express-validator");


exports.register = (req, res, next) => {
    const errors = validationResult(req);
    console.log(req.body);

    if (!errors.isEmpty()) {
      return res.status(422).jsonp(errors.array());
    } else {
      bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new userSchema({
          name: req.body.name,
          email: req.body.email,
          password: hash
        });
        user
          .save()
          .then(response => {
            res.status(201).json({
              message: "Account was successfully created!",
              result: response
            });
          })
          .catch(error => {
            res.status(500).json({
              error: error.message
            });
          });
      });
    }
}

exports.authenticate = (req, res) => {
  let getUser;
  userSchema
    .findOne({
      email: req.body.email
    })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Authentication failed"
        });
      }
      getUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(response => {
      if (!response) {
        return res.status(401).json({
          message: "Authentication failed"
        });
      }
      let jwtToken = jwt.sign(
        {
          email: getUser.email,
          userId: getUser._id
        },
        "longer-secret-is-better",
        {
          expiresIn: "24h"
        }
      );
      res.status(200).json({
        token: jwtToken,
        expiresIn: 3600,
        data: getUser
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Authentication failed"
      });
    });
};

exports.getUser = (req, res) => {
    userSchema.find((error, response) => {
      if (error) {
        return next(error);
      } else {
        res.status(200).json({
            data: response
        });
      }
    });
}

exports.currentUser = (req, res) => {
  if (req.headers && req.headers.authorization) {
    var authorization = req.headers.authorization;
    var part = authorization.split(" ")[1];
    
   let base64Url = part.split(".")[1]; // token you get
   let base64 = base64Url.replace("-", "+").replace("_", "/");
   let decodedData = JSON.parse(
     Buffer.from(base64, "base64").toString("binary")
   );
    // res.send(decodedData);
   userSchema
     .findById(decodedData["userId"] )
     .then(user => {
       if (!user) {
         return res.status(404).send({
           message: "Unauthorized User"
         });
       } else {
         res.status(200).json({
           data: user
         });
       }
     })
     .catch(err => {
       if (err.kind === "ObjectId") {
         return res.status(404).send({
           message: "User not found"
         });
       }
       return res.status(500).send({
         message: "Error retrieving user with id "
       });
     });
  }
};

exports.searchUser = (req, res) => {
  userSchema
    .findById(req.params.id)
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: "Answer not found for question selected " + req.params.id
        });
      } else {
        res.send(user);
      }
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Answer not found for question selected" + req.params.id
        });
      }
      return res.status(500).send({
        message: "Error retrieving note with id " + req.params.id
      });
    });
}
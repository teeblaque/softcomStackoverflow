// var expect = require("chai").expect;
const chai = require("chai");
const expect = chai.expect;

var app = require("../server");
//import chai-http to send requests to the app
const http = require('chai-http');
chai.use(http);

//import User model
const User = require('../app/models/user.model');

describe('App basic tests', () => {
   before(done => {
     //delete all users
     User.find()
       .deleteMany()
       .then(res => {
         console.log("Users removed");
         done();
       })
       .catch(err => {
         console.log(err.message);
       });
   });

   it("/GET should return 200 and a message", done => {
     //send a GET request to /
     chai
       .request(app)
       .get("/")
       .then(res => {
         //validate response has a message
         expect(res).to.have.status(200);
         expect(res.body.message).to.be.equal("Welcome to softcomNg!");
         done();
       })
       .catch(err => {
         console.log(err);
       });
   });
});

describe("User registration", () => {
  it("Should return 201 and confirmation for valid input", done => {
    //mock valid user input
    const new_user = {
      name: "Ajayi Taiwo",
      email: "ajayitaiwo89@gmail.com",
      password: "12345678"
    };
    //send request to the app
    chai
      .request(app)
      .post("/api/v1/signup")
      .send(new_user)
      .then(res => {
        //console.log(res.body);
        //assertions
        expect(res).to.have.status(201);
        expect(res.body.message).to.be.equal("User created!!!");
        // expect(res.body.errors.length).to.be.equal(0);
        done();
      })
      .catch(err => {
        console.log(err.message);
      });
  });
});

describe("User authenticatication", () => {
  it("should return 200 and token for valid credentials", done => {
    //mock valid user input
    const valid_input = {
      email: "ajayitaiwo89@gmail.com",
      password: "12345678"
    };
    //send request to the app
    chai
      .request(app)
      .post("/api/v1/login")
      .send(valid_input)
      .then(res => {
        //console.log(res.body);
        //assertions
        expect(res).to.have.status(200);
        expect(res.body.token).to.exist;
        expect(res.body.message).to.be.equal("User logged In");
        // expect(res.body.errors.length).to.be.equal(0);
        done();
      })
      .catch(err => {
        console.log(err.message);
      });
  });
});

describe('unprotected route', () => {
  it("/ GET all questions should return 200 and a message", done => {
    //send a GET request to /
    chai
      .request(app)
      .get("/api/v1/questions")
      .then(res => {
        //validate response has a message
        expect(res).to.have.status(200);
        expect(res.body.message).to.be.equal("success");
        done();
      })
      .catch(err => {
        console.log(err);
      });
  });

  it("/ GET all users should return 200 and a message", done => {
    //send a GET request to /
    chai
      .request(app)
      .get("/api/v1/users")
      .then(res => {
        //validate response has a message
        expect(res).to.have.status(200);
        expect(res.body.message).to.be.equal("success");
        done();
      })
      .catch(err => {
        console.log(err);
      });
  });
})

describe('protected route', () => {
  it("should return error 401 if no valid token provided", (done) => {
    //send request with no token
    chai.request(app).get('/api/v1/current-user')
    .set('Authorization', '')
    .then(res => {
      expect(res).to.have.status(401);
      expect(res.body.message).to.be.equal("Authentication failed!");
      done();
    }).catch(err => {
      console.log(err.message);
    })
  });

  it("should return 200 and create question if valid token provided", () => {
    //mock login to get token
    const valid_input = {
      email: "ajayitaiwo89@gmail.com",
      password: "12345678"
    };
    //send login request to the app to receive token
    chai
      .request(app)
      .post("/api/v1/login")
      .send(valid_input)
      .then(login_response => {
        //add token to next request Authorization headers as Bearer adw3R£$4wF43F3waf4G34fwf3wc232!w1C"3F3VR
        const token = "Bearer " + login_response.body.token;
        const valid_input = {
          title: "Unit testtttt",
          content: "Ask a question"
        };
        chai
          .request(app)
          .post("/api/v1/questions/ask")
          .set("Authorization", token)
          .send(valid_input)
          .then(protected_response => {
            //assertions
            expect(protected_response).to.have.status(200);
            expect(protected_response.body.message).to.be.equal(
              "Question created!"
            );
            //  expect(protected_response.body.user.email).to.exist;
            // expect(protected_response.body.errors.length).to.be.equal(0);
            done();
          })
          .catch(err => {
            console.log(err.message);
          });
      })
      .catch(err => {
        console.log(err.message);
      });
  });

   it("should return 200 and user details if valid token provided", () => {
     //mock login to get token
     const valid_input = {
       email: "ajayitaiwo89@gmail.com ",
       password: "12345678"
     };
     //send login request to the app to receive token
     chai
       .request(app)
       .post("/api/v1/login")
       .send(valid_input)
       .then(login_response => {
         //add token to next request Authorization headers as Bearer adw3R£$4wF43F3waf4G34fwf3wc232!w1C"3F3VR
         const token = "Bearer " + login_response.body.token;
         chai
           .request(app)
           .get("/api/v1/current-user")
           .set("Authorization", token)
           .then(protected_response => {
             //assertions
             expect(protected_response).to.have.status(200);
             expect(protected_response.body.message).to.be.equal("Welcome");
             expect(protected_response.body.user.email).to.exist;
             expect(protected_response.body.errors.length).to.be.equal(0);
             done();
           })
           .catch(err => {
             console.log(err.message);
           });
       })
       .catch(err => {
         console.log(err.message);
       });
   });

  after(done => {
    //stop app server
    console.log("All tests completed, stopping server....");
    process.exit();
    done();
  });
})


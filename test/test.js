// var expect = require("chai").expect;
const chai = require("chai");
const expect = chai.expect;

var app = require("../server");
var request = require("request");
var should = require("should");
var supertest = require("supertest");
//import chai-http to send requests to the app
const http = require('chai-http');

chai.use(http);


//let's set up the data we need to pass to the login method
// var server = supertest.agent("http://localhost:4000/api/v1");

describe("App basics", () => {

  it("Should exists", () => {
    expect(app).to.be.a("function");
  });

  it("GET / should return 200 and message", done => {
    //send request to the app
    chai
      .request(app)
      .get("/")
      .then(res => {
        //assertions
        //console.log(res.body);
        expect(res).to.have.status(200);
        expect(res.body.message).to.contain("Yabadabadooo");
        done();
      })
      .catch(err => {
        console.log(err.message);
      });
  });
});

describe("User registration", () => {
  it("Should return 201 and confirmation for valid input", done => {
    //mock valid user input
    const new_user = {
      name: "Ajayi Taiwo",
      email: "ajayitaiwo89@gmail.com",
      password: "secret"
    };
    //send request to the app
    chai
      .request(app)
      .post("/api/v1/signup")
      .send(new_user)
      .then(res => {
        console.log(res.body);
        //assertions
        expect(res).to.have.status(201);
        expect(res.body.message).to.be.equal("Account was successfully created!");
        expect(res.body.errors.length).to.be.equal(0);
        done();
      })
      .catch(err => {
        console.log(err.message);
      });
  });
});

  describe("User login", () => {
    it("should return 200 and token for valid credentials", done => {
      //mock invalid user input
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
          expect(res.body.errors.length).to.be.equal(0);
          done();
        })
        .catch(err => {
          console.log(err.message);
        });
    });
  });

  describe("Users Action", () => {
    it("Should exists", () => {
      expect(app).to.be.a("function");
    });

    it("GET / should return 200 and message for a users", done => {
      //send request to the app
      chai
        .request(app)
        .get("/api/v1/users")
        .then(res => {
          //assertions
          //console.log(res.body);
          expect(res).to.have.status(200);
          expect(res.body.message).to.contain("data");
          done();
        })
        .catch(err => {
          console.log(err.message);
        });
    });
  });


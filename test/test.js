var expect = require("chai").expect;
var app = require("../server");
var request = require("request");
var should = require("should");
var supertest = require("supertest");

//let's set up the data we need to pass to the login method

var server = supertest.agent("http://localhost:4000/api/v1");

describe("Authentication", function() {
  describe("It should save users record", function() {
    it("register", function(done) {
      const userCredentials = {
        name: "Ajayi Taiwo",
        email: "ajayitaiwo89@gmail.com",
        password: "12345678"
      };
      // var authenticatedUser = request.agent(app);
      server
        .post("/signup")
        .expect("Content-type", /text/)
        .expect(200)
        .send(userCredentials)
        .end(function(error, response) {
          expect(response.statusCode).to.equal(200);
          done();
        });
    });

    it("login", function(done) {
      const userCredentials = {
        email: "ajayitaiwo89@gmail.com",
        password: "12345678"
      };
      // var authenticatedUser = request.agent(app);
      server
        .post("/login")
        .expect("Content-type", /text/)
        .send(userCredentials)
        .end(function(error, response) {
          expect(response.statusCode).to.equal(200);
          done();
        });
    });
  });

  describe("check login", function() {
    it("should return a 200 response if the user is logged in", function(done) {
      server.get('/current-user')
      .expect("Content-type",/text/)
      .expect(200)
      .end(function(err, res){
        res.status.should.expect(200)
        done()
      })
    });
    it("should return a 302 response if the user is not logged in", function(done) {
      server
        .get("/current-user")
        .expect("Content-type", /text/)
        .expect(302)
        .end(function(err, res) {
          res.status.should.expect(302);
          done();
        });
    });
  });
});

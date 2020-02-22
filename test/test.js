var expect = require("chai").expect;
var app = require("../server");
var request = require("request");

//let's set up the data we need to pass to the login method

describe("Authentication", function() {
  describe("It should save users record", function() {
    it("register", function(done) {
      const userCredentials = {
        name: "Ajayi Taiwo",
        email: "ajayitaiwo89@gmail.com",
        password: "12345678"
      };
      var authenticatedUser = request.agent(app);
      authenticatedUser
        .post("/signup")
        .send(userCredentials)
        .end(function(error, response) {
          expect(response.statusCode).to.equal(201);
          done();
        });
    });

    it("login", function(done) {
      const userCredentials = {
        email: "ajayitaiwo89@gmail.com",
        password: "12345678"
      };
      var authenticatedUser = request.agent(app);
      authenticatedUser
        .post("/signup")
        .send(userCredentials)
        .end(function(error, response) {
          expect(response.statusCode).to.equal(200);
          done();
        });
    });
  });

  describe("check login", function() {
    it("should return a 200 response if the user is logged in", function(done) {
      request("http://localhost:4004/current-user", function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });
    it("should return a 302 response if the user is not logged in", function(done) {
      request("http://localhost:4004/current-user", function(
        error,
        response,
        body
      ) {
        expect(response.statusCode).to.equal(302);
        done();
      });
    });
  });
});

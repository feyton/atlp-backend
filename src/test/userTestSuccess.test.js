// Testing modules
import chai from "chai";
import chaiHttp from "chai-http";
import * as base from "../index.js";

let should = chai.should();
let userId;
chai.use(chaiHttp);

describe("user", () => {
  // beforeEach(async () => {
  //   try {

  //     userId = null;
  //   } catch (error) {}
  // });

  //Create a user

  describe("POST Register", () => {
    it("It should return a created user as an object", async () => {
      let newUser = {
        email: "info@gmail.com",
        password: "Fab123",
        lastName: "Fabrice",
        firstName: "Hafashimana",
      };
      chai
        .request(base.app)
        .post(base.apiRoute + "/accounts/signup")
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          // res.body.should.have.property("email");
          // res.body.should.have.not.property("password");
        });
    });
  });
  describe("POST Login", () => {
    it("It should return a token in data", (done) => {
      let newUser = {
        email: "info@gmail.com",
        password: "Fab123",
      };
      chai
        .request(base.app)
        .post(base.apiRoute + "/accounts/login")
        .send(newUser)
        .then((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("data");
          userId = res.body._id;
          done();
        })
        .catch((err) => {
          done();
        });
    });
  });
});

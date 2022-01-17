// Testing modules
import chai from "chai";
import chaiHttp from "chai-http";
import * as base from "../index.js";
let should = chai.should();
let userId;
chai.use(chaiHttp);

describe("User- Fail&Errors", () => {
  //Create a user

  describe("POST Register", () => {
    it("It should return an error object", async () => {
      let newUser = {
        email: "infogmail.com",
        password: "12365",
        lastName: "Fabrice",
      };
      chai
        .request(base.app)
        .post(base.apiRoute + "/accounts/signup")
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("data").should.be.a("object");
          userId = res.body._id;
        });
    });
  });
  describe("User Login ", () => {
    it("It should return an array of errors", async () => {
      let info = {
        email: "infogmail.com",
        password: "123",
      };
      chai
        .request(base.app)
        .post(base.apiRoute + "/accounts/login")
        .send(info)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("data");
          userId = res.body._id;
        });
    });
  });
});

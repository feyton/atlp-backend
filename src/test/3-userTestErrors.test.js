import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { apiRoute, app } from "../index.js";

chai.use(chaiHttp);

describe("User- Fail& Errors", async () => {
  //Create a user

  describe("Registering user with invalid data", () => {
    it("It should return an error object containing 3 objects", async () => {
      let newUser = {
        email: "infogmail.com",
        password: "12365",
        lastName: "Fabrice",
      };
      const userPost = await chai
        .request(app)
        .post(apiRoute + "/accounts/signup")
        .send(newUser);
      expect(userPost).to.have.status(400);
      expect(userPost.body).to.be.a("object");
      expect(userPost.body).to.have.property("data").to.be.a("array");
      expect(userPost.body.data.length).to.eql(3);
    });
  });
  describe("User Login ", () => {
    it("It should return an array of errors", async () => {
      let info = {
        email: "infogmail.com",
        password: "123",
      };
      const userLogin = await chai
        .request(app)
        .post(apiRoute + "/accounts/login")
        .send(info);
      expect(userLogin).to.have.status(400);
      expect(userLogin.body).to.be.a("object");
      expect(userLogin.body).to.have.property("data");
    });
  });
});

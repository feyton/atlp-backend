// Testing modules
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { apiRoute, app } from "../index.js";
import { userModel } from "../userApp/models.js";

chai.use(chaiHttp);

describe("CRUD Operations on the user module", async () => {
  before(async () => {
    await userModel.deleteMany({});
    console.log("User database cleared.");
  });
  const newUser = {
    firstName: "Fabrice",
    lastName: "Hafashimana",
    password: "Fab12345@",
    email: "fabrice@me.com",
  };
  let token, userId;
  describe("Successful user registration", async () => {
    it("It should return a created user without the password property", async () => {
      const result = await chai
        .request(app)
        .post(apiRoute + "/accounts/signup")
        .send(newUser);
      expect(result.body).to.have.property("data");
      expect(result).to.have.status(201);
      expect(result.body.data.user).to.not.have.property("password");
      expect(result.body.data.user).to.have.property("_id");
      userId = result.body.data.user._id;
      // console.log(userId);
    });
  });
  describe("Login an existing user", async () => {
    it("Should return a JWT token for logged in user", async () => {
      const result = await chai
        .request(app)
        .post(apiRoute + "/accounts/login")
        .send({
          password: "Fab12345@",
          email: "fabrice@me.com",
        });
      expect(result).to.have.status(200);
      expect(result.body).to.have.property("data");
      expect(result.body.data).to.have.property("token");
      expect(result.body).to.have.property("status").eql("success");
      token = result.body.data.token;
      // console.log(token);
    });
  });
  describe("Updating an existing user", async () => {
    it("Should update the user and return a new name", async () => {
      const updatedUser = {
        firstName: "New name",
        lastName: "New last name",
      };
      // console.log(userId, token);
      const result = await chai
        .request(app)
        .put(apiRoute + "/accounts/profile/" + userId)
        .send(updatedUser)
        .set("Authorization", "Bearer " + token);
      expect(result).to.have.status(201);
      expect(result.body).to.have.property("data");
      expect(result.body.data).to.have.property("firstName").to.eql("New name");
    });
  });
});

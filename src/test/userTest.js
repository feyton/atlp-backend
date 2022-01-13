import mongoose from "mongoose";

import * as userModels from "../userApp/models.js";

// Testing modules
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import * as base from "../index.js";

let should = chai.should();
let userId;
chai.use(chaiHttp);

describe("user", () => {
  beforeEach(async () => {
    try {
      await userModels.userModel.deleteMany({});
      userId = null;
    } catch (error) {}
  });

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
        .post("/account/signup")
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have.not.property("password");
          userId = res.body._id;
        });
    });
  });
});

process.env.NODE_ENV = "test";

import mongoose from "mongoose";

import * as blogModels from "../blogApp/models.js";

// Testing modules
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import * as base from "../index.js";

let should = chai.should();

chai.use(chaiHttp);

describe("blog", function () {
  beforeEach(async function () {
    try {
      await blogModels.blogModel.deleteMany({});
    } catch (error) {
      throw error;
    }
  });
  //Testing get

  describe("GET Blog", () => {
    it("it should return an object and No posts array", function (done) {
      try {
        chai
          .request(base.app)
          .get("/blog")
          .end(function (err, res) {
            if (err) {
              throw err;
            }


            res.should.have.status(201);
            res.body.should.be.a("object");
            done();
          });
      } catch (error) {
        throw error;
      }
    });
  });
  describe("POST Blog", () => {
    it("It should return An forbidden request", function (done) {
      let post = {
        title: "The new macbook pro hello author 2",
        content: "Here is content",
        summary: "Here goes our summary",
      };
      chai
        .request(base.app)
        .post("/blog")
        .send(post)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });
});

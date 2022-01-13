process.env.NODE_ENV = "test";

import mongoose from "mongoose";

import * as blogModels from "../blogApp/models.js";

// Testing modules
import chai from "chai";
import chaiHttp from "chai-http";
import * as base from "../index.js";

let should = chai.should();

chai.use(chaiHttp);

describe("books", () => {
  beforeEach((done) => {
    blogModels.blogModel.remove({}),
      (err) => {
        done();
      };
  });
  //Testing get

  describe("GET posts", () => {
    it("it should GET all the posts", (done) => {
      chai
        .request(base.app)
        .get("/blog")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });
});

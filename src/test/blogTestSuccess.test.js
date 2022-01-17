process.env.NODE_ENV = "test";

// Testing modules
import chai from "chai";
import chaiHttp from "chai-http";
import * as blogModels from "../blogApp/models.js";
import * as base from "../index.js";
import * as userModels from "../userApp/models.js";

let should = chai.should();

chai.use(chaiHttp);

describe("Blog Tests", function () {
  beforeEach(async function () {
    try {
      await blogModels.blogModel.deleteMany({});
      await userModels.userModel.deleteMany({});
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
          .get(base.apiRoute + "/blogs")
          .end(function (err, res) {
            if (err) {
              throw err;
            }

            res.should.have.status(200);
            res.body.should.be.a("object");
            // res.body.length.should.be(0);
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
        .post(base.apiRoute + "/blogs")
        .send(post)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          done();
        });
    });
  });
  describe("POST Blog after login", () => {
    it("It should return An forbidden request", function (done) {
      let post = {
        title: "The new macbook pro hello author 2",
        content: "Here is content",
        summary: "Here goes our summary",
      };
      let newUser = {
        email: "blog@gmail.com",
        password: "Fab1234@3.",
        lastName: "Fabrice",
        firstName: "Hafashiamana",
      };
      let userId;

      // SignUp
      chai
        .request(base.app)
        .post(base.apiRoute + "/accounts/signup")
        .send(newUser)
        .then((err, res) => {
          res.should.have.status(200);
          done();
          chai
            .request(base.app)
            .post(base.apiRoute + "/accounts/login")
            .send(newUser)
            .then((err, res) => {
              res.should.have.status(200);
              done();
              chai
                .request(base.app)
                .post(base.apiRoute + "/blogs")
                .send(post)
                .then((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a("object");
                  res.body.should.have.property("data");

                  done();
                })
                .catch((err) => {
                  done();
                });
            })
            .catch((err) => {
              done();
            });
        })
        .catch((err) => {
          done();
        });
    });
  });
});

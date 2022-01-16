process.env.NODE_ENV = "test";

// Testing modules
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import * as blogModels from "../blogApp/models.js";
import * as base from "../index.js";
import * as userModels from "../userApp/models.js";

let should = chai.should();

chai.use(chaiHttp);

describe("Blog Testing Error Handling", function () {
  //Scope variables
  let postEditId;
  //Testing get

  describe("GET Blog", async () => {
    it("it should return an object and No posts array", async function (done) {
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
            expect(res.body.data.length).to.eql(0);
            done()
          });
      } catch (error) {
        throw error;
      }
    });
  });
  describe("POST Blog", async () => {
    it("It should return An forbidden request error", async function (done) {
      let post = {
        title: "Post 1",
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
          return Promise.resolve(done)
        });
    });
  });
  describe("Adding a Blog after login", async () => {
    it("It should return An forbidden request", async function (done) {
      let post = {
        title: "The new macbook pro hello author 2",
        content: "Here is content",
        summary: "Here goes our summary",
      };
      let newUser = {
        email: "blog@gmadfil.com",
        password: "Fab1234.",
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
          expect(res.body.data.user).not.to.have.property("password");
          expect(res.body.data.user).to.have.property("firstName");
          done();
          chai
            .request(base.app)
            .post(base.apiRoute + "/accounts/login")
            .send(newUser)
            .then((err, res) => {
              res.should.have.status(200);
              expect(res.body.data).to.have.property("token");
              done();
              chai
                .request(base.app)
                .post(base.apiRoute + "/blogs")
                .send(post)
                .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a("object");
                  res.body.should.have.property("data");
                  expect(res.body.data).to.have.property("slug");

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
          return Promise.resolve(done)
        });
    });
  });
  describe("GET Blog", async () => {
    it("it should return an object with a post", async function (done) {
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
            expect(res.body.data.length).to.eql(1);
            postEditId = res.body.data._id;
            console.log(postEditId);
            done();
          });
      } catch (error) {
        throw error;
      }
    });
  });

  describe("Updating blog", async () => {
    it("It should return an updated post", function (done) {
      let post = {
        title: "Post 1 updated",
        content: "Here is content",
        summary: "Here goes our summary",
      };

      // SignUp
      chai
        .request(base.app)
        .put(base.apiRoute + "/blogs/" + postEditId)
        .send(post)
        .then((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("data");
          expect(res.body.data).to.have.property("slug");

          done();
        })
        .catch((err) => {
          done();
        });
    });
  });
});

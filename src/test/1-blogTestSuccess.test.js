// Testing modules
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { blogModel } from "../blogApp/models.js";
import { apiRoute, app } from "../index.js";

chai.use(chaiHttp);
let agent = chai.request.agent(app);

describe("CRUD Operations on blog", async () => {
  before(async () => {
    await blogModel.deleteMany({});
  });
  let token, userId, postId, publishedPostId;
  let post = {
    title: "Post 1 test",
    content: "Here is content",
    summary: "Here goes our summary",
  };
  let postUpdate = {
    title: "Test 1 updated",
    content: "Here is content",
    summary: "Here goes our summary",
    published: false,
  };
  let author2 = {
    email: "blog@gmail.com",
    password: "Fab1234@3.",
    lastName: "Fabrice",
    firstName: "Hafashiamana",
  };

  describe("Login a blog post Author/User", async () => {
    it("Should return a token for the logged in user", async () => {
      let userInfo = {
        password: "Fab12345@",
        email: "fabrice@me.com",
      };
      const userResult = await agent

        .post(apiRoute + "/accounts/login")
        .send(userInfo);
      token = userResult.body.data.token;
    });
  });
  describe("Post tests", async () => {
    it("Should return a newly created post", async () => {
      const postCreation = await chai
        .request(app)
        .post(apiRoute + "/blogs")
        .send(post)
        .set("Authorization", "Bearer " + token);
      expect(postCreation).to.have.status(200);
      expect(postCreation.body.data).to.have.property("slug");
      postId = postCreation.body.data._id;
    });
    it("Should return an object with one post that was created", async () => {
      const blogsRequest = await chai.request(app).get(apiRoute + "/blogs");

      expect(blogsRequest).to.have.status(200);
      expect(blogsRequest.body).to.be.a("object");
      expect(blogsRequest.body.data.length).to.eql(1);
    });
    it("It should return an updated blog post with a new title", async () => {
      const updateRequest = await chai
        .request(app)
        .put(apiRoute + "/blogs/" + postId)
        .send(postUpdate)
        .set("Authorization", "Bearer " + token);

      expect(updateRequest).to.have.status(200);
      expect(updateRequest.body.data.title).to.eql("Test 1 updated");
      expect(updateRequest.body.data.published).to.eql(false);
    });
    it("Should return an array with 0 posts", async () => {
      const blogsRequest = await chai.request(app).get(apiRoute + "/blogs");

      expect(blogsRequest).to.have.status(200);
      expect(blogsRequest.body).to.be.a("object");
      expect(blogsRequest.body.data.length).to.eql(0);
    });
  });

  describe("Get a single published post", async () =>
    it("Should return a blog post", async () => {
      const blogDetail = await chai
        .request(app)
        .get(apiRoute + "/blogs/" + postId);
      expect(blogDetail).to.have.status(200);
      expect(blogDetail.body).to.have.property("status").eql("success");
    }));

  describe("Logout a user and ", async () =>
    it("Should not logout the current user", async () => {
      const userLogout = await agent.post(apiRoute + "/accounts/logout");
      expect(userLogout).to.have.status(400);
      expect(userLogout.body).to.have.property("status").eql("fail");
    }));
  describe("Return a 200 for an unpublished post ", async () =>
    it("Should get an unpublished post for its owner", async () => {
      const blogDetail = await chai
        .request(app)
        .get(apiRoute + "/blogs/" + postId);
      expect(blogDetail).to.have.status(200);
      expect(blogDetail.body.data).to.have.property("author");
    }));
});

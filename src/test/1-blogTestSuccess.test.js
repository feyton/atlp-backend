// Testing modules
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { blogModel } from "../blogApp/models.js";
import { apiRoute, app } from "../index.js";

chai.use(chaiHttp);

describe("CRUD Operations on blog", async () => {
  before(async () => {
    await blogModel.deleteMany({});
  });
  let token, userId, postId, publishedPostId, post2ID, token2;
  let post = {
    title: "Post 1 test",
    content: "Here is content",
    summary: "Here goes our summary",
  };
  let post2 = {
    title: "Post 1 test",
    content: "Here is content",
    summary: "Here goes our summary",
  };
  let postUpdate = {
    title: "Test 1 updated",
    content: "Here is content",
    summary: "Here goes our summary",
    published: "false",
  };
  let author2 = {
    email: "blog@gmail.com",
    password: "Fab1234@3.",
    lastName: "Fabrice",
    firstName: "Hafashimana",
  };

  describe("Login a blog post Author/User", async () => {
    it("It should return a token for the logged in user", async () => {
      let userInfo = {
        password: "Fab12345@",
        email: "fabrice@me.com",
      };
      const userResult = await chai
        .request(app)
        .post(apiRoute + "/accounts/login")
        .send(userInfo);
      expect(userResult).to.have.status(200);
      token = userResult.body.data.token;
    });
  });
  describe("Creating a new post", async () => {
    it("Should return a newly created post", async () => {
      const postCreation = await chai
        .request(app)
        .post(apiRoute + "/blogs")
        .send(post)
        .set("Authorization", "Bearer " + token);
      expect(postCreation).to.have.status(201);
      expect(postCreation.body.data).to.have.property("slug");
      postId = postCreation.body.data._id;
    });
  });

  describe("Get a list of blog posts", () => {
    it("it should return an object with one post that was created", async () => {
      const blogsRequest = await chai.request(app).get(apiRoute + "/blogs");

      expect(blogsRequest).to.have.status(200);
      expect(blogsRequest.body).to.be.a("object");
      expect(blogsRequest.body.data.length).to.eql(1);
    });
  });

  describe("Updating the blog post", async () => {
    it("It should return an updated blog post with a new title", async () => {
      const updateRequest = await chai
        .request(app)
        .put(apiRoute + "/blogs/" + postId)
        .send(postUpdate)
        .set("Authorization", "Bearer " + token);

      expect(updateRequest).to.have.status(201);
      expect(updateRequest.body.data.title).to.eql("Test 1 updated");
      expect(updateRequest.body.data.published).to.eql(false);
    });
  });
  describe("Get a list of created posts", async () => {
    it("Should return an array with 0 posts", async () => {
      const blogsRequest = await chai.request(app).get(apiRoute + "/blogs");

      expect(blogsRequest).to.have.status(200);
      expect(blogsRequest.body).to.be.a("object");
      expect(blogsRequest.body.data.length).to.eql(0);
    });
  });

  describe("Fail to Get a single published post", async () =>
    it("Should return a 404 although the blog exist", async () => {
      const blogDetail = await chai
        .request(app)
        .get(apiRoute + "/blogs/" + postId);

      expect(blogDetail).to.have.status(403);
      expect(blogDetail.body).to.have.property("status").eql("fail");
    }));

  describe("Accessing a blog with different account", async () => {
    it("Should register and login a new user", async () => {
      const result = await chai
        .request(app)
        .post(apiRoute + "/accounts/signup")
        .send(author2);
      // userId = result.body.data.user._id;
      const loginRequest = await chai
        .request(app)
        .post(apiRoute + "/accounts/login")
        .send(author2);
      expect(loginRequest.body.data).to.have.property("token");
      token2 = loginRequest.body.data.token;
    });
    it("Should create a new post for the author 2", async () => {
      const postCreation = await chai
        .request(app)
        .post(apiRoute + "/blogs")
        .send(post)
        .set("Authorization", "Bearer " + token2);
      expect(postCreation).to.have.status(201);
      expect(postCreation.body.data).to.have.property("slug");
      post2ID = postCreation.body.data._id;
    });
    it("Should return a conflict error", async () => {
      const postCreation = await chai
        .request(app)
        .post(apiRoute + "/blogs")
        .send(post)
        .set("Authorization", "Bearer " + token2);
      expect(postCreation).to.have.status(409);
    });

    it("Should return a forbiden error", async () => {
      const blogDetail = await chai
        .request(app)
        .delete(apiRoute + "/blogs/" + postId)
        .set("Authorization", "Bearer " + token2);
      expect(blogDetail).to.have.status(403);
    });

    it("Should fail to return an unpublished post", async () => {
      const blogDetail = await chai
        .request(app)
        .get(apiRoute + "/blogs/" + postId);
      expect(blogDetail).to.have.status(403);
    });
  });
});

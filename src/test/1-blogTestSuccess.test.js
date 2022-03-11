// Testing modules
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { blogModel } from "../blogApp/models.js";
import { apiRoute, app } from "../index.js";
import { userModel } from "../userApp/models.js";

chai.use(chaiHttp);

describe("CRUD Operations on blog", async () => {
  before(async () => {
    await blogModel.deleteMany({});
    console.log("User and blog cleared");
  });
  let token, userId, postId, publishedPostId, post2ID, token2;
  let post = {
    title: "Post 1 test",
    content: "Here is content",
    summary: "Here goes our summary",
  };
  let post2 = {
    title: "Post 2 test",
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
  let adminUserdata = {
    email: "admin@gmail.com",
    password: "Fab1234@3.",
    lastName: "Fabrice",
    firstName: "Hafashimana",
    roles: {
      User: 0,
      Admin: 1,
    },
  };

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

  it("it should return an object with one post that was created", async () => {
    const blogsRequest = await chai.request(app).get(apiRoute + "/blogs");

    expect(blogsRequest).to.have.status(200);
    expect(blogsRequest.body).to.be.a("object");
    expect(blogsRequest.body.data.length).to.eql(0);
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

  it("Should return a 404 although the blog exist", async () => {
    const blogDetail = await chai
      .request(app)
      .get(apiRoute + "/blogs/" + postId);

    expect(blogDetail).to.have.status(403);
    expect(blogDetail.body).to.have.property("status").eql("fail");
  });

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
  describe("Test the Task view", async () => {
    let taskID;
    it("Should return a list of tasks", async () => {
      const result = await chai
        .request(app)
        .get(apiRoute + "/tasks/")
        .set("Authorization", "Bearer " + token2);
      expect(result).to.have.status(200);
      expect(result.body.data).to.be.an("array");
    });
    it("Should create a new Task for the user", async () => {
      const result = await chai
        .request(app)
        .post(apiRoute + "/tasks/")
        .set("Authorization", "Bearer " + token2)
        .send({
          body: "To refine my code",
        });
      expect(result).to.have.status(201);
      expect(result.body.data).to.have.property("owner");
      taskID = result.body.data._id;
    });
    it("Should delete a task", async () => {
      const result = await chai
        .request(app)
        .delete(apiRoute + "/tasks/" + taskID)
        .set("Authorization", "Bearer " + token2);

      expect(result).to.have.status(200);
      expect(result.body.data).to.be.an("object");
    });
  });
  let ticket, messageID;
  describe("Test the Contact view for non admins", async () => {
    it("Should return a forbiden request error for non admin user", async () => {
      const result = await chai
        .request(app)
        .get(apiRoute + "/contacts/")
        .set("Authorization", "Bearer " + token2);
      expect(result).to.have.status(403);
    });
    it("Should create a new message and send the ticket", async () => {
      const result = await chai
        .request(app)
        .post(apiRoute + "/contacts/")

        .send({
          message: "To refine my code",
          name: "Fabrice",
          email: "tumbafabruce@gmail.com",
        });
      expect(result).to.have.status(201);
      expect(result.body.data).to.have.property("ticket");
      ticket = result.body.data.ticket;
      messageID = result.body.data._id;
    });
    it("Should return a message status", async () => {
      const result = await chai
        .request(app)
        .get(apiRoute + "/contacts/status/" + ticket);

      expect(result).to.have.status(200);
      expect(result.body.data).to.be.an("object");
    });
  });
  describe("Contact App for admin user", async () => {
    let tokenAdmin;
    before(async () => {
      const adminUser = await userModel.create(adminUserdata);
      const result = await chai
        .request(app)
        .post(apiRoute + "/accounts/login")
        .send({
          email: "admin@gmail.com",
          password: "Fab1234@3.",
        });
      tokenAdmin = result.body.data.token;
      console.log("Admin logged in");
    });

    it("Should return a list of all messages", async () => {
      const result = await chai
        .request(app)
        .get(apiRoute + "/contacts/")
        .set("Authorization", "Bearer " + tokenAdmin);
      expect(result).to.have.status(200);
      expect(result.body).to.have.property("data");
    });
    it("Should add a reply to the message", async () => {
      const result = await chai
        .request(app)
        .put(apiRoute + "/contacts/" + messageID)
        .set("Authorization", "Bearer " + tokenAdmin)
        .send({
          reply: "Your request has been responded",
        });

      expect(result).to.have.status(200);
      expect(result.body).to.have.property("data");
    });
    it("Should add a reply to the message", async () => {
      const result = await chai
        .request(app)
        .put(apiRoute + "/contacts/" + messageID)
        .set("Authorization", "Bearer " + tokenAdmin)
        .send({
          reply: "Your request has been responded",
        });

      expect(result).to.have.status(400);
      expect(result.body).to.have.property("data");
    });
  });
});

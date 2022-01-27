import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { apiRoute, app } from "../index.js";

chai.use(chaiHttp);

describe("Blog Testing Error Handling", async () => {
  it("It should return a bad request error for missing the token in header", async () => {
    let post = {
      title: "Post 1",
      content: "Here is content",
      summary: "Here goes our summary",
    };
    const blogRequest = await chai
      .request(app)
      .post(apiRoute + "/blogs")
      .send(post);

    expect(blogRequest).to.have.status(401);
    expect(blogRequest.body).to.be.a("object");
  });

  it("It should return an unauthorized response even though the user is created successfully", async () => {
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
    const userSignUp = await chai
      .request(app)
      .post(apiRoute + "/accounts/signup")
      .send(newUser);
    expect(userSignUp).to.have.status(201);
    expect(userSignUp.body.data.user.email).to.eql("blog@gmadfil.com");
    userId = userSignUp.body.data.user._id;

    const userLogin = await chai
      .request(app)
      .post(apiRoute + "/accounts/login")
      .send(newUser);
    expect(userLogin).to.have.status(200);

    const userPostCreation = await chai
      .request(app)
      .post(apiRoute + "/blogs")
      .send(post);

    expect(userPostCreation).to.have.status(401);
    expect(userPostCreation.body).to.be.a("object");
    expect(userPostCreation.body).to.not.have.property("data");
  });
});

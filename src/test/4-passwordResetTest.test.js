import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { apiRoute, app } from "../index.js";

chai.use(chaiHttp);

describe("Password reset for API user", async () => {
  const newUser = {
    firstName: "Fabrice",
    lastName: "Hafashimana",
    password: "Fab12345@",
    email: "reset@me.com",
  };
  before(async () => {
    const result = await chai
      .request(app)
      .post(apiRoute + "/accounts/signup")
      .send(newUser);
  });

  it("Should return a password reset link", async () => {
    const result = await chai
      .request(app)
      .post(apiRoute + "/accounts/password-reset")
      .send(newUser);
    expect(result).to.have.status(200);
    expect(result.body).to.have.property("data");
  });
});

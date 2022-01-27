import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { app } from "../../index.js";
chai.use(chaiHttp);

describe("Index routing", async () => {
  it("Should return a 200 status", async () => {
    const home = await chai.request(app).get("/");
    expect(home).to.have.status(200);
  });
});

const request = require("supertest");
const app = require("../src/server");

describe("Should do something", () => {
  test("Should work", async () => {
    // const response = await request(app).get("/test").send({});
    expect(1).toBe(1);
  });
});

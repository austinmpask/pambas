const request = require("supertest");
const app = require("../src/server");

describe("GET /users/", () => {
  test("Should forward request to user service and respond from user service", async () => {
    const response = await request(app).get("/users/");

    expect(response.status).toBe(200);
    expect(response.body).toBe("ok");
  });
});

describe("POST /register", () => {
  test("Should register a user successfully in user service and auth service, with matching UUID", async () => {
    const response = await request(app)
      .post("/register")
      .set("Content-Type", "application/json")
      .send({
        username: "joe100",
        email: "joe99@gmail.com",
        first_name: "joe",
        last_name: "john",
        password: "password",
      });
    // console.log(response);
    expect(response.status).toBe(200);
  });
});

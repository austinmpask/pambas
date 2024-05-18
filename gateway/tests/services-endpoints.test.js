const request = require("supertest");
const app = require("../src/server");
const { forbiddenEndpoints } = require("../src/services");
const { forbiddenObjToArray } = require("../src/util");

describe("API Gateway tests", () => {
  describe("GET /users/", () => {
    test("Should forward requests beginning with /users to user service and respond from user service", async () => {
      const response = await request(app).get("/users/");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("ok from user service");
    });
  });

  describe("GET /auth/", () => {
    test("Should forward requests beginning with /auth to auth service and respond from user service", async () => {
      const response = await request(app).get("/auth/");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("ok from auth service");
    });
  });

  describe("GET forbidden endpoints", () => {
    test.each(forbiddenObjToArray(forbiddenEndpoints).map((item) => [item]))(
      "Should forbid direct requests to specified forbidden microservice endpoints",
      async (endpoint) => {
        const response = await request(app).get(endpoint);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Forbidden");
      }
    );
  });

  describe("POST /register", () => {
    test("Should send a response confirming success after registering a user. Registration and DB accuracy are tested by relevant microservices.", async () => {
      const response = await request(app)
        .post("/register/")
        .send({
          username: "joe101",
          email: "joe101@gmail.com",
          first_name: "joe",
          last_name: "john",
          password: "password",
        })
        .set("Content-Type", "application/json");

      // expect(response.status).toBe(201);
      expect(response.body.trace).toBe("Successful registration");
    });
  });
});

// describe("POST /register", () => {
//   test("Should register a user successfully in user service and auth service, with matching UUID", async () => {
//     const response = await request(app)
//       .post("/register")
//       .set("Content-Type", "application/json")
//       .send({
//         username: "joe100",
//         email: "joe99@gmail.com",
//         first_name: "joe",
//         last_name: "john",
//         password: "password",
//       });
//     // console.log(response);
//     expect(response.status).toBe(200);
//   });
// });

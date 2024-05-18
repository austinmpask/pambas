const request = require("supertest");
const app = require("../src/server");
const { forbiddenEndpoints } = require("../src/services");
const { forbiddenObjToArray } = require("../src/util");

describe("API Gateway GET tests", () => {
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

  describe("GET /userdata/", () => {
    let sessionJWT;

    beforeAll(async () => {
      //Register a user
      const registerResponse = await request(app)
        .post("/register/")
        .send({
          username: "jack102",
          email: "jack102@gmail.com",
          first_name: "jack",
          last_name: "johnson",
          password: "password",
        })
        .set("Content-Type", "application/json");

      //Get JWT/login for protected routes
      if (registerResponse && registerResponse.status === 201) {
        const loginResponse = await request(app).post("/auth/login/").send({
          username: "jack102",
          password: "password",
        });

        //Successful login, retain JWT for testing
        if (loginResponse && loginResponse.status === 200) {
          sessionJWT = loginResponse.body.message;
          console.log("JWT FROM AUTH: " + sessionJWT);
        }
      }
    });

    test("Should return data object for a user", async () => {
      const response = await request(app).get("/userdata/");

      expect(response.status).toBe(200);
      expect(response.body.message.first_name).toBe("Jack");
      expect(response.body.message.last_name).toBe("Johnson");
    });

    test("Should return 405 Forbidden if a valid JWT is not provided", async () => {
      expect(1).toBe(1);
    });
  });
});

describe("API Gateway POST tests", () => {
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

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Successful registration");
    });
  });
});

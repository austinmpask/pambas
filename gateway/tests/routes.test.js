const request = require("supertest");
const app = require("../src/server");
const { forbiddenEndpoints } = require("../src/services");
const { forbiddenObjToArray } = require("../src/utils/forbiddenObjToArray");

//Proxy requests to microservices
describe("Forward direct microservice requests", () => {
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
});

//Gateway endpoints
describe("Gateway endpoints", () => {
  describe("/register", () => {
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

  describe("Protected routes", () => {
    let sessionJWT;

    beforeAll(async () => {
      //Register a user

      const payload = {
        username: "jack102",
        email: "jack102@gmail.com",
        first_name: "jack",
        last_name: "johnson",
        password: "password",
      };

      const registerResponse = await request(app)
        .post("/register/")
        .send(payload)
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
        } else {
          throw new Error("Couldnt get JWT!");
        }
      }
    });

    describe("/project", () => {
      describe("POST /project", () => {
        test("Should indicate success after valid project data provided", async () => {
          const payload = {
            budget: "10",
            manager: "bossman",
            name: "examplename",
            type: 1,
            sections: [
              {
                section: "1",
                controls: "3",
              },
              {
                section: "2",
                controls: "4",
              },
            ],
          };

          const response = await request(app)
            .post("/project/")
            .set("Cookie", [`token=${sessionJWT}`])
            .send(payload);

          expect(response.status).toBe(201);

          // const message = JSON.parse(response.body.message);

          expect(response.body.message).toBe("Project added");
        });
      });
    });

    describe("/userdata", () => {
      describe("GET /userdata", () => {
        test("Should return data object for a user", async () => {
          const response = await request(app)
            .get("/userdata/")
            .set("Cookie", [`token=${sessionJWT}`]);

          expect(response.status).toBe(200);

          const message = JSON.parse(response.body.message);

          expect(message.first_name).toBe("Jack");
          expect(message.last_name).toBe("Johnson");
          expect(message.email).toBe("jack102@gmail.com");
          expect(message.username).toBe("jack102");
        });
      });

      describe("PUT /userdata", () => {
        test("Should return first and last name object for a user upon a valid change", async () => {
          const newFirst = "Billie";
          const newLast = "Jean";

          const payload = {
            first_name: newFirst,
            last_name: newLast,
          };

          const response = await request(app)
            .put("/userdata/")
            .send(payload)
            .set("Cookie", [`token=${sessionJWT}`]);

          expect(response.status).toBe(200);

          const message = JSON.parse(response.body.message);

          expect(message.first_name).toBe(newFirst);
          expect(message.last_name).toBe(newLast);
        });
      });
    });
  });
});

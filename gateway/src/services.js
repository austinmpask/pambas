//Microservices and their targets
const services = [
  {
    route: "/users",
    target: "http://user-service:5000",
  },
  {
    route: "/auth",
    target: "http://auth-service:5000",
  },
];

//Forbidden microservice endpoints - not to be directly accessed. Only to be accessed by gateway logic
const forbiddenEndpoints = {
  users: ["/register"],
  auth: ["/register", "/shallowdelete"],
};

module.exports = { services, forbiddenEndpoints };

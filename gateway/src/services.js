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
  {
    route: "/notes",
    target: "http://note-service:5000",
  },
];

module.exports = services;

const services = require("../services");

//Return a full URL for any API endpoint
function apiEnd(apiSlug, endpoint) {
  const apiHost = services.find((item) => item.route === apiSlug).target;
  return apiHost + endpoint;
}

module.exports = apiEnd;

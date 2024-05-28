const { services } = require("../services");

//Return a full URL for any API endpoint
function getApiEndpoint(apiSlug, endpoint) {
  const apiHost = services.find((item) => item.route === apiSlug).target;
  return apiHost + endpoint;
}

module.exports = { getApiEndpoint };

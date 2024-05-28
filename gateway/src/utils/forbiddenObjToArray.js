//Convert the human readable forbidden endpoints object to an array of endpoint literals
function forbiddenObjToArray(obj) {
  const paths = [];

  for (let [service, endpoints] of Object.entries(obj)) {
    endpoints.forEach((endpoint) => {
      const route = "/" + service + endpoint;
      paths.push(route);
      paths.push(route + "/");
    });
  }
  return paths;
}

module.exports = { forbiddenObjToArray };

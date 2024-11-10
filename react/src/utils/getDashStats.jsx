/*-------------------Cleaned up 11/10/24-------------------*/

// Make some calculations based on the projectSummaryData which is passed in from dashboard card
export default function getDashStats(data) {
  //Calculate the total hours within budget which havent been billed
  const hours = data.reduce(
    (a, project) => a + project.budget - project.billed,
    0
  );

  //Sum up number of open items for all the projects
  const items = data.reduce((a, project) => a + project.openItems, 0);

  return { hours, items };
}

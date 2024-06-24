import { createContext, useState } from "react";

//Context to store a list of all projects associated with a user, along with some high level information about each one.
export const ProjectSummaryContext = createContext();

export const ProjectSummaryProvider = ({ initialData, children }) => {
  //Dynamic context with state
  const [projectSummaryData, setProjectSummaryData] = useState(initialData);

  return (
    <ProjectSummaryContext.Provider
      value={{ projectSummaryData, setProjectSummaryData }}
    >
      {children}
    </ProjectSummaryContext.Provider>
  );
};

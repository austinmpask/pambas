//React
import { useEffect, useContext, useState, createContext } from "react";
import { useParams } from "react-router-dom";

//Contexts
import { ProjectSummaryContext } from "src/context/ProjectSummaryContext";

//Children
import NavBar from "src/components/navbar/Navbar";
import ProjectHeader from "src/components/projectpage/ProjectHeader";
import ProjectGrid from "src/components/projectpage/ProjectGrid";

//Utils
import updateProjectDetail from "src/utils/updateProjectDetail";

//Context to pass updater function to children
export const ProjectUpdaterContext = createContext(undefined);

//User project main interactable page. Isolates a slice of state for the current project which is passed as prop to children
export default function ProjectPage() {
  //Get the current project ID
  const routeParams = useParams();
  const projectID = Number(routeParams.id);

  //Consume context containing high level project details of all projects
  const { projectSummaryData, setProjectSummaryData } = useContext(
    ProjectSummaryContext
  );

  //Indicator if the user directly triggered a state update
  const [loading, setLoading] = useState(false);

  //State for slice of context related to current project as to not directly mutate context obj
  //Passed to children as prop for easier reference
  const [contextSlice, setContextSlice] = useState(undefined);

  //State for project index with regard to position in list of this user's projects
  const [projectIndex, setProjectIndex] = useState(undefined);

  //When the project context list is updated, the context slice is updated to reflect it
  useEffect(() => {
    //Isolate the relevant project details from the context based on
    //the ID prop for current project
    setContextSlice(
      projectSummaryData.find((project) => {
        return project.id === projectID;
      })
    );

    //Find the index of the project with regard to the project summary context
    setProjectIndex(
      projectSummaryData.findIndex((project) => {
        return project.id === projectID;
      })
    );
  }, [projectSummaryData]);

  //Updater function passed to child components inorder to trigger an api request along with context change
  function updateContext(key, value) {
    setLoading(true);

    //Update the slice with whatever the value the user changed
    const newSlice = {
      ...contextSlice,
      [key]: value,
    };

    const newContext = [...projectSummaryData];
    //Replace with new slice
    newContext[projectIndex] = newSlice;

    //Update context (optimistic update)
    setProjectSummaryData(newContext);
  }

  //Whenever context slice is updated (by means of the whole context obj changing), make request to update project in DB (if user triggered an update (loading))
  useEffect(() => {
    async function makeRequest() {
      //Make request
      const response = await updateProjectDetail(projectID, contextSlice);

      if (response.ok) {
        setLoading(false);

        //Update the context with what is returned by api. Should not truly change any values (context was previously optimistically updated)
        const newState = response.data;

        setProjectSummaryData((old) => {
          const newContext = [...old];

          newContext[projectIndex] = newState;
          return newContext;
        });
      } else {
        //Error response
        console.error(response.error);
        setLoading(false);
      }
    }

    //Only make api request if the user directly triggered the state update
    loading && makeRequest();
  }, [contextSlice]);

  return (
    <>
      <NavBar />
      <ProjectUpdaterContext.Provider value={updateContext}>
        <ProjectHeader contextSlice={contextSlice} />
        <div className="m-6">
          <ProjectGrid contextSlice={contextSlice} />
        </div>
      </ProjectUpdaterContext.Provider>
    </>
  );
}

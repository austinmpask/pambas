//React
import { useEffect, useContext, useState, createContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

//Contexts
import { ProjectSummaryContext } from "src/context/ProjectSummaryContext";

//Children
import NavBar from "src/components/navbar/Navbar";
import ProjectHeader from "src/components/projectpage/ProjectHeader";
import ProjectGrid from "src/components/projectpage/ProjectGrid";

//Utils
import toastRequest from "src/utils/toastRequest";
import { CSSTransition } from "react-transition-group";

//Context to pass updater function to children
export const ProjectUpdaterContext = createContext(undefined);

//Context to hold calculated stats about project based on the line item data

//User project main interactable page. Isolates a slice of state for the current project which is passed as prop to children
export default function ProjectPage() {
  const navigate = useNavigate();
  //Get the current project ID
  const routeParams = useParams();
  const projectID = Number(routeParams.id);

  //Consume context containing high level project details of all projects
  const { projectSummaryData, setProjectSummaryData } = useContext(
    ProjectSummaryContext
  );

  //State for all the grid details about the project to populate components
  const [projectDetails, setProjectDetails] = useState();

  //Indicator if the user directly triggered a state update
  const [loading, setLoading] = useState(false);

  //State for slice of context related to current project as to not directly mutate context obj
  //Passed to children as prop for easier reference
  const [contextSlice, setContextSlice] = useState(undefined);

  //State for project index with regard to position in list of this user's projects
  const [projectIndex, setProjectIndex] = useState(undefined);

  //State for header stats that originally come from the project summary call, but are indirectly affected by line item updates
  const [headerStats, setHeaderStats] = useState({
    completed: 1,
    total: 1,
    openItems: 0,
  });

  //When the project summary context list is updated, the context slice is updated to reflect it
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
  function updateProjectSummaryContext(key, value) {
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

  //Whenever context slice is updated (by means of the whole summary context obj changing), make request to update project in DB (if user triggered an update (loading))
  useEffect(() => {
    async function makeRequest() {
      await toastRequest({
        method: "PUT",
        route: `/project/${projectID}`,
        data: contextSlice,
        successCB: (data) => {
          setProjectSummaryData((old) => {
            const newContext = [...old];

            newContext[projectIndex] = data;
            return newContext;
          });
        },
        success: "Project Updated!",
      });
      setLoading(false);
    }

    //Only make api request if the user directly triggered the state update
    loading && makeRequest();

    //If context has loaded, fetch the bulk project details from api
    async function fetchProject() {
      await toastRequest({
        method: "GET",
        route: `/project/${contextSlice.id}`,
        sToastDisabled: true,
        eToastDisabled: true,
        successCB: (data) => setProjectDetails(data),
        errorCB: () => navigate("/dashboard"),
      });
    }

    contextSlice && fetchProject();

    contextSlice &&
      setHeaderStats((prev) => ({
        ...prev,
        openItems: contextSlice.openItems,
        completed: contextSlice.completed,
        total: contextSlice.total,
      }));
  }, [contextSlice]);

  return (
    <>
      <div className="has-background-light">
        <NavBar />
        <ProjectUpdaterContext.Provider value={updateProjectSummaryContext}>
          <CSSTransition
            in={contextSlice}
            unmountOnExit
            timeout={360}
            classNames={"header-card"}
          >
            <ProjectHeader
              contextSlice={contextSlice}
              projectDetails={projectDetails}
              headerStats={headerStats}
              setProjectDetails={setProjectDetails}
            />
          </CSSTransition>
          <ProjectGrid
            contextSlice={contextSlice}
            projectDetails={projectDetails}
            setHeaderStats={setHeaderStats}
          />
        </ProjectUpdaterContext.Provider>
      </div>
    </>
  );
}

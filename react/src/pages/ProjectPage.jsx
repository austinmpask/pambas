//React
import { useEffect, useContext, useState, createContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

//Contexts
import { ProjectSummaryContext } from "src/context/ProjectSummaryContext";
import { LockoutProvider } from "src/context/LockoutContext";

//Children
import NavBar from "src/components/navbar/Navbar";
import ProjectHeader from "src/components/projectpage/ProjectHeader";
import ProjectGrid from "src/components/projectpage/ProjectGrid";

//Utils
import toastRequest from "src/utils/toastRequest";
import { UIVars } from "src/utils/validations";

//Context to pass updater function to children
export const ProjectUpdaterContext = createContext();

//Store stats shown by the project header, affected by line item component children
export const HeaderStatsContext = createContext();

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

  //State for header stats that originally come from the project summary call, but are affected by line item side effects
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

  //If context has loaded, fetch the detailed project information from api, and save to state
  useEffect(() => {
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

    //Fetch the project details from DB if summary context slice is not undefined
    contextSlice && fetchProject();

    //Update the header stats which will be affected by line item side effects
    contextSlice &&
      setHeaderStats((prev) => ({
        ...prev,
        openItems: contextSlice.openItems,
        completed: contextSlice.completed,
        total: contextSlice.total,
      }));
  }, [contextSlice]);

  //Whenever context slice is updated, make request to update project in DB **IF** user triggered the update (loading)
  useEffect(() => {
    async function updateProject() {
      await toastRequest({
        method: "PUT",
        route: `/project/${projectID}`,
        data: contextSlice,
        sToastDisabled: true,
        successCB: (data) => {
          setProjectSummaryData((old) => {
            const newContext = [...old];

            newContext[projectIndex] = data;
            return newContext;
          });
        },
      });
      setLoading(false);
    }

    //Only make api request to update the project if the user directly triggered the state update
    loading && updateProject();
  }, [contextSlice]);

  //Updater function passed to child components inorder to trigger an api request taking key/val pair
  function updateProjectSummaryContext(key, value) {
    setLoading(true);

    //Make proper adjustment to add/subtract billing
    if (key === "billed") {
      value = Math.min(200, Math.max(0, contextSlice["billed"] + value));
    }

    //Update the slice with whatever the value the user changed
    const newSlice = {
      ...contextSlice,
      [key]: value,
    };

    //Copy context array and replace the slice
    const newContext = [...projectSummaryData];
    newContext[projectIndex] = newSlice;

    //Update context (optimistic update)
    setProjectSummaryData(newContext);
  }

  return (
    <>
      <LockoutProvider>
        <div className="fixed -z-50 w-full h-full bg-projBg bg-proj-img bg-proj-size" />
        <NavBar />
        <HeaderStatsContext.Provider value={{ headerStats, setHeaderStats }}>
          <ProjectUpdaterContext.Provider value={updateProjectSummaryContext}>
            {/* Slide in project detail header from top */}

            {contextSlice && (
              <ProjectHeader
                contextSlice={contextSlice}
                projectDetails={projectDetails}
                setProjectDetails={setProjectDetails}
              />
            )}

            {/* Component for project sections */}
            <ProjectGrid
              contextSlice={contextSlice}
              projectDetails={projectDetails}
            />
          </ProjectUpdaterContext.Provider>
        </HeaderStatsContext.Provider>
      </LockoutProvider>
    </>
  );
}

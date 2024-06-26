//React
import { useContext, useEffect, useRef, useState } from "react";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareMinus, faSquarePlus } from "@fortawesome/free-solid-svg-icons";

//Contexts
import { ProjectSummaryContext } from "src/context/ProjectSummaryContext";

//Children
import ProgressBar from "@ramonak/react-progress-bar";
import ProjectEditableField from "src/components/projectpage/ProjectEditableField";
import ProjectGrid from "src/components/projectpage/ProjectGrid";

//Title component/wrapper for labeled pages
export default function ProjectHeader({ projectID }) {
  //Consume context containing high level project details of all projects
  const { projectSummaryData, setProjectSummaryData } = useContext(
    ProjectSummaryContext
  );

  //Indicator if api request is pending
  const [loading, setLoading] = useState(false);

  //State for slice of context related to current project as to not directly mutate context obj
  const [contextSlice, setContextSlice] = useState(undefined);

  //State for project index with regard to position in list of this user's projects
  const [projectIndex, setProjectIndex] = useState(undefined);

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

  //Whenever context slice is updated, make request to update project in DB
  useEffect(() => {
    if (loading) {
      setLoading(false);
      console.log("api req here");
      console.log(contextSlice);
    }
  }, [contextSlice]);

  function updateContext(key, value) {
    setLoading(true);
    const newSlice = {
      ...contextSlice,
      [key]: value,
    };
    const newContext = [...projectSummaryData];
    //Replace with new slice
    newContext[projectIndex] = newSlice;

    //Update context and close UI
    setProjectSummaryData(newContext);
  }

  return (
    contextSlice && (
      <div className="m-5 page-wrapper">
        <div className="card has-background-dark title-card">
          <ProjectEditableField
            initialContent={contextSlice.title}
            objKey="title"
            onSubmit={updateContext}
            title={true}
          />
          <div className="block mb-4 mt-2 ml-3 mr-3">
            <ProgressBar
              height="3px"
              bgColor="#23db5e"
              isLabelVisible={false}
              completed={15}
              maxCompleted={contextSlice.budget}
            />
            <span className="icon">
              <FontAwesomeIcon icon={faSquarePlus} />
            </span>
            <span className="icon">
              <FontAwesomeIcon icon={faSquareMinus} />
            </span>

            <div className="block">
              <span>{contextSlice.projectType}</span>
            </div>
            <div className="block">
              <span>{`${
                contextSlice.budget - contextSlice.billed
              } hours remaining`}</span>
            </div>
            <div className="block">
              <ProjectEditableField
                initialContent={contextSlice.projectManager}
                objKey="projectManager"
                onSubmit={updateContext}
                title={false}
              />
            </div>
          </div>
        </div>

        <div className="m-6">
          <ProjectGrid
            projectID={projectID}
            checkBoxHeaders={contextSlice.checkBoxHeaders}
          />
        </div>
      </div>
    )
  );
}

//React
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//Children
import ProjectSection from "src/components/projectpage/ProjectSection";

//Utils
import getProject from "src/utils/getProject";

//Grid interface displaying all of the user's projects
export default function ProjectGrid({ contextSlice, updateContext }) {
  const navigate = useNavigate();

  //State for all the grid details about the project to populate components
  const [projectDetails, setProjectDetails] = useState(undefined);

  //If context has loaded, fetch the bulk project details from api
  useEffect(() => {
    async function fetchProject() {
      const dataObj = await getProject(contextSlice.id);
      if (dataObj.ok) {
        setProjectDetails(dataObj.data);
      } else {
        //Couldnt find project/user doesnt own project
        navigate("/dashboard");
      }
    }

    //Wait until context populated from other api call
    contextSlice && fetchProject();
  }, [contextSlice]);

  return (
    projectDetails && (
      <div className="container">
        {projectDetails.sections.map((section, index) => {
          return (
            <ProjectSection
              contextSlice={contextSlice}
              sectionData={section}
              index={index}
              key={index}
              updateContext={updateContext}
            />
          );
        })}
      </div>
    )
  );
}

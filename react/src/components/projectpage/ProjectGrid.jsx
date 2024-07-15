//React
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//Children
import ProjectSection from "src/components/projectpage/ProjectSection";

//Utils
import toastRequest from "../../utils/toastRequest";

//Grid interface displaying all of the user's projects
export default function ProjectGrid({ contextSlice }) {
  const navigate = useNavigate();

  //State for all the grid details about the project to populate components
  const [projectDetails, setProjectDetails] = useState();

  //If context has loaded, fetch the bulk project details from api
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

    //Wait until context populated from other api call
    contextSlice && fetchProject();
  }, [contextSlice]);

  return (
    projectDetails && (
      <div className="container grid-container pb-6">
        {projectDetails.sections.map((section, index) => {
          return (
            <ProjectSection
              contextSlice={contextSlice}
              sectionData={section}
              index={index}
              key={index}
            />
          );
        })}
      </div>
    )
  );
}

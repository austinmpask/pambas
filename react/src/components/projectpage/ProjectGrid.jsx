import ProjectSection from "src/components/projectpage/ProjectSection";
import { useNavigate } from "react-router-dom";

//React
import { useEffect, useState } from "react";

//Utils
import getProject from "src/utils/getProject";

export default function ProjectGrid({ projectID, checkBoxHeaders }) {
  const navigate = useNavigate();

  const [projectDetails, setProjectDetails] = useState(undefined);

  useEffect(() => {
    async function fetchProject() {
      const dataObj = await getProject(projectID);
      if (dataObj.ok) {
        setProjectDetails(dataObj.data);
      } else {
        navigate("/dashboard");
      }
    }

    fetchProject();
  }, []);

  return (
    projectDetails && (
      <div className="container">
        {projectDetails.sections.map((section, index) => {
          return (
            <ProjectSection
              checkBoxHeaders={checkBoxHeaders}
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

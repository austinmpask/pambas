//React
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

//Children
import PageWrapper from "src/components/PageWrapper";
import NavBar from "src/components/navbar/Navbar";
import ProjectHeader from "src/components/projectpage/ProjectHeader";
import ProjectGrid from "src/components/projectpage/ProjectGrid";

//Utils
import getProject from "src/utils/getProject";

export default function ProjectPage() {
  const navigate = useNavigate();
  const routeParams = useParams();

  const [projectData, setProjectData] = useState(undefined);

  useEffect(() => {
    async function fetchProject(id) {
      const dataObj = await getProject(id);
      if (dataObj.ok) {
        setProjectData(dataObj.data);
      } else {
        navigate("/dashboard");
      }
    }

    fetchProject(routeParams.id);
  }, []);

  if (!projectData) {
    return null;
  }

  return (
    <>
      <NavBar />
      <PageWrapper title={projectData.title}>
        <div className="has-background-dark">
          <ProjectHeader projectData={projectData} />
          <ProjectGrid projectData={projectData} />
        </div>
      </PageWrapper>
    </>
  );
}

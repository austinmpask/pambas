import { useParams } from "react-router-dom";

//Children
// import ProjectPageWrapper from "src/components/projectpage/ProjectPageWrapper";
import NavBar from "src/components/navbar/Navbar";
import ProjectHeader from "src/components/projectpage/ProjectHeader";

//User project main interactable page
export default function ProjectPage() {
  //Pass the project ID as prop to children
  const routeParams = useParams();
  const projectID = Number(routeParams.id);

  return (
    <>
      <NavBar />
      <ProjectHeader projectID={projectID} />
    </>
  );
}

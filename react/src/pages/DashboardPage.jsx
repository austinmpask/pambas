//React
import { useContext, useEffect, useState } from "react";

//Contexts
import { UserContext } from "src/context/UserContext";
import { ProjectSummaryContext } from "src/context/ProjectSummaryContext";
//Children
import PageWrapper from "src/components/PageWrapper";
import NavBar from "src/components/navbar/Navbar";

export default function DashboardPage() {
  const { userData } = useContext(UserContext);
  const projectSummaryData = useContext(ProjectSummaryContext);

  const [projectCount, setProjectCount] = useState(0);

  useEffect(() => {
    if (projectSummaryData) {
      setProjectCount(projectSummaryData.length);
    }
  }, [projectSummaryData]);

  return (
    <>
      <NavBar />
      <PageWrapper title={userData.firstName + "'s Dashboard"}>
        <div>{projectCount} projects</div>
      </PageWrapper>
    </>
  );
}

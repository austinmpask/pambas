//React
import { useContext, useEffect, useState } from "react";

//Contexts
import { UserContext } from "src/context/UserContext";
import { ProjectSummaryContext } from "src/context/ProjectSummaryContext";
//Children
import PageWrapper from "src/components/PageWrapper";

export default function DashboardPage() {
  const { userData } = useContext(UserContext);
  const { projectSummaryData } = useContext(ProjectSummaryContext);

  const [projectCount, setProjectCount] = useState(0);

  useEffect(() => {
    if (projectSummaryData) {
      setProjectCount(projectSummaryData.length);
    }
  }, [projectSummaryData]);

  return (
    <PageWrapper title={userData.firstName + "'s Dashboard"}>
      <div>{projectCount} projects</div>
    </PageWrapper>
  );
}

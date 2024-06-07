import { useContext } from "react";
import PageWrapper from "src/components/PageWrapper";
import { UserContext } from "src/context/UserContext";

export default function DashboardPage() {
  const { userData } = useContext(UserContext);
  return (
    <PageWrapper title={userData.firstName + "'s Dashboard"}>
      <div>dashboard here</div>
    </PageWrapper>
  );
}

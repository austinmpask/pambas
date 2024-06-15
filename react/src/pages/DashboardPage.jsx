import { useContext } from "react";
import PageWrapper from "src/components/PageWrapper";
import NavBar from "src/components/navbar/Navbar";
import { UserContext } from "src/context/UserContext";

export default function DashboardPage() {
  const { userData } = useContext(UserContext);
  return (
    <>
      <NavBar />
      <PageWrapper title={userData.firstName + "'s Dashboard"}>
        <div>dashboard here</div>
      </PageWrapper>
    </>
  );
}

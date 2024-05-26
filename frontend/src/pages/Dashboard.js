import { useContext } from "react";
import PageContent from "../components/ApplicationPage/PageContent";
import UserContext from "../context/UserContext";

export default function Dashboard() {
  const { firstName } = useContext(UserContext);
  return (
    <PageContent title={firstName + "'s Dashboard"}>
      <p>dfjhsdkfhsdkjfhASKDFHKASDJFHKJASDHFKJAS</p>
    </PageContent>
  );
}

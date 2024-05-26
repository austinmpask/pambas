import { useContext } from "react";
import PageContent from "../components/ApplicationPage/PageContent";
import UserContext from "../context/UserContext";

export default function Dashboard() {
  const dataObj = useContext(UserContext);
  return <PageContent title="Settings"></PageContent>;
}

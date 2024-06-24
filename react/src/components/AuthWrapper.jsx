//React
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//Contexts
import { UserProvider } from "src/context/UserContext";
import { ProjectSummaryProvider } from "src/context/ProjectSummaryContext";

//Utils
import makeAuthRequest from "src/utils/makeAuthRequest";
import makeSummaryRequest from "src/utils/makeSummaryRequest";

//Determine if user is authenticated, update user state if so, if not, redirect to login
export default function AuthWrapper({ children }) {
  const navigate = useNavigate();

  const [authenticated, setAuthenticated] = useState(false);

  //Data which will be collected from api
  const [projectSummaryData, setProjectSummaryData] = useState([]);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
  });

  //Attempt to query for user data on first render (JWT required)
  useEffect(() => {
    async function getResponse() {
      const response = await makeAuthRequest();
      //Apply data from auth request to state for context, set authenticated status
      if (response.ok) {
        //Update user state, then collect the user's projects
        setUserData(response.data);

        //Project high level detail request
        const summaryResponse = await makeSummaryRequest();

        if (summaryResponse.ok) {
          setProjectSummaryData(summaryResponse.data);
          setAuthenticated(true);
        } else if (summaryResponse.status === 404) {
          setAuthenticated(true);
        }
      } else {
        navigate("/login");
      }
    }
    getResponse();
  }, [navigate]);

  //Provide context providers with initial state data if authenticated
  return authenticated ? (
    <ProjectSummaryProvider initialData={projectSummaryData}>
      <UserProvider initialData={userData} children={children} />
    </ProjectSummaryProvider>
  ) : null;
}

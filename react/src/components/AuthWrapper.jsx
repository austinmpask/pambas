//React
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//Children
import Navbar from "src/components/navbar/Navbar";

//Contexts
import { UserProvider } from "src/context/UserContext";
import { ProjectSummaryProvider } from "src/context/ProjectSummaryContext";

//Toasts
import { ToastContainer } from "react-toastify";

//Utils
import toastRequest from "src/utils/toastRequest";

//Determine if user is authenticated, update user state if so, if not, redirect to login
export default function AuthWrapper({ children }) {
  const navigate = useNavigate();

  //State for conditional page rendering
  const [authenticated, setAuthenticated] = useState(false);

  //Data which will be collected from api
  const [projectSummaryData, setProjectSummaryData] = useState([]);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
  });

  //Attempt to query for user data on first render & set project summary context(JWT required)
  useEffect(() => {
    async function getResponse() {
      //Lookup user data
      await toastRequest({
        method: "GET",
        route: "/userdata",
        successCB: (data) => {
          setUserData(data);
        },
        errorCB: () => navigate("/login"),
        sToastDisabled: true,
        eToastDisabled: true,
      });

      //Lookup project summary info
      await toastRequest({
        method: "GET",
        route: "/project",
        successCB: (data) => setProjectSummaryData(data),
        sToastDisabled: true,
        eToastDisabled: true,
      });

      //Render page
      setAuthenticated(true);
    }
    getResponse();
  }, []);

  //Provide context providers with initial state data if authenticated
  return authenticated ? (
    <>
      <ToastContainer />
      <ProjectSummaryProvider initialData={projectSummaryData}>
        <UserProvider initialData={userData}>
          <>
            <Navbar />
            {children}
          </>
        </UserProvider>
      </ProjectSummaryProvider>
    </>
  ) : null;
}

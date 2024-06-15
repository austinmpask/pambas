//React
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//Contexts
import { UserProvider } from "src/context/UserContext";

//Utils
import makeAuthRequest from "src/utils/makeAuthRequest";

//Determine if user is authenticated, update user state if so, if not, redirect to login
export default function AuthWrapper({ children }) {
  const navigate = useNavigate();

  const [authenticated, setAuthenticated] = useState(false);

  //Data which will be collected from api
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
        setUserData(response.data);
        setAuthenticated(true);
      } else {
        navigate("/login");
      }
    }
    getResponse();
  }, [navigate]);

  //Provide context provider with initial state data if authenticated
  return authenticated ? (
    <UserProvider initialData={userData} children={children} />
  ) : null;
}

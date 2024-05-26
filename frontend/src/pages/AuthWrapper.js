import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

export default function AuthWrapper({ children }) {
  const navigate = useNavigate();

  const [authenticated, setAuthenticated] = useState(false);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
  });

  //Attempt to query for user data on first render (JWT required)
  useEffect(() => {
    async function makeRequest() {
      try {
        //If logged in the JWT should be included automatically
        const response = await axios.get("/userdata");

        if (response.status === 200) {
          //User was authenticated, date rec.
          setAuthenticated(true);

          const dataObj = JSON.parse(response.data.message);
          setUserData({
            firstName: dataObj.first_name,
            lastName: dataObj.last_name,
            email: dataObj.email,
            username: dataObj.username,
          });
        }
      } catch (error) {
        navigate("/login");
      }
    }
    makeRequest();
  }, [navigate]);

  if (authenticated) {
    return (
      <UserContext.Provider value={userData}>{children}</UserContext.Provider>
    );
  }

  return null;
}

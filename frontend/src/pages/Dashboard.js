import UserInfo from "../components/UserInfo";
import NavBar from "../components/NavBar/NavBar";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const [authenticated, setAuthenticated] = useState(false);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
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
          });
        }
      } catch (error) {
        if (error.response) {
          //Not logged in/no JWT triggers 405 forbidden
          if (error.response.status === 405) {
            navigate("/login");
          } else {
            //Some other error
            navigate("/error");
          }
        }
      }
    }
    makeRequest();
  }, [navigate]);

  if (authenticated) {
    return (
      <>
        <NavBar />
        <h1>Dashboard</h1>
        <UserInfo data={userData} />
      </>
    );
  }

  return null;
}

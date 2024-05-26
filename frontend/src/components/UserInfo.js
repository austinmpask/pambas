import { useContext } from "react";
import UserContext from "../context/UserContext";

export default function UserInfo() {
  const userData = useContext(UserContext);

  return <h2>Hi, {userData.firstName}</h2>;
}

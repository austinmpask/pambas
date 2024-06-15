//React
import { createContext, useState } from "react";

//User context for user info to display across ui
export const UserContext = createContext();

export const UserProvider = ({ initialData, children }) => {
  //Dynamic context with state
  const [userData, setUserData] = useState(initialData);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ initialData, children }) => {
  const [userData, setUserData] = useState(initialData);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

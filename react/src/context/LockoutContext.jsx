import { createContext, useState } from "react";

//Context to track when a user is currently interacting with one line item/ui element
export const LockoutContext = createContext(false);

export const LockoutProvider = ({ children }) => {
  //Dynamic context with state
  const [lockout, setLockout] = useState(false);

  return (
    <LockoutContext.Provider value={{ lockout, setLockout }}>
      {children}
    </LockoutContext.Provider>
  );
};

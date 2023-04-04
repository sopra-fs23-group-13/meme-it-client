import { ReactNode } from "react";
import { useState, createContext } from "react";

const contextDefaultValues = {
  finalGameData: [],
  setFinalGameData: () => {},
};

export const AppContext = createContext(contextDefaultValues);
const AppContextProvider = ({ children }) => {
  const [finalGameData, setFinalGameData] = useState(
    contextDefaultValues.finalGameData
  );

  return (
    <AppContext.Provider
      value={{
        finalGameData,
        setFinalGameData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export default AppContextProvider;
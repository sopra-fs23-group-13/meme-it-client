import { useState, createContext } from "react";

const contextDefaultValues = {
  gameData: [],
  setGameData: () => {}
};

export const AppContext = createContext(contextDefaultValues);
const AppContextProvider = ({ children }) => {

  const [gameData, setGameData] = useState(
      contextDefaultValues.gameData
  )

  return (
    <AppContext.Provider
      value={{
        gameData,
        setGameData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export default AppContextProvider;
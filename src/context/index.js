import { useState, createContext } from "react";

const contextDefaultValues = {
  gameData: [],
  setGameData: () => {},
  loadedGameData: [],
  setLoadedGameData: () => {}
};

export const AppContext = createContext(contextDefaultValues);
const AppContextProvider = ({ children }) => {

  const [gameData, setGameData] = useState(
      contextDefaultValues.gameData
  );
  const [loadedGameData, setLoadedGameData] = useState(
        contextDefaultValues.loadedGameData
    )

  return (
    <AppContext.Provider
      value={{
        gameData,
        setGameData,
        loadedGameData,
        setLoadedGameData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export default AppContextProvider;
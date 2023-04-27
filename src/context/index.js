import { useState, createContext } from "react";
import 'bootstrap/dist/css/bootstrap.css'; // or include from a CDN
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';

const contextDefaultValues = {
  gameData: [],
  setGameData: () => {},
  loadedGameData: [],
  setLoadedGameData: () => {},
  preLoadedMemesForVoting: [],
  setPreLoadedMemesForVoting: () => {}
};

export const AppContext = createContext(contextDefaultValues);
const AppContextProvider = ({ children }) => {

  const [gameData, setGameData] = useState(
      contextDefaultValues.gameData
  );
  const [loadedGameData, setLoadedGameData] = useState(
        contextDefaultValues.loadedGameData
  );
  const [preLoadedMemesForVoting, setPreLoadedMemesForVoting] = useState(
        contextDefaultValues.preLoadedMemesForVoting
  );

  return (
    <AppContext.Provider
      value={{
        gameData,
        setGameData,
        loadedGameData,
        setLoadedGameData,
        preLoadedMemesForVoting,
        setPreLoadedMemesForVoting
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export default AppContextProvider;
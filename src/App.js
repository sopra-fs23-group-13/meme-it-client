import AppRouter from "components/routing/routers/AppRouter";
import AppContextProvider from "./context";
/**
 * Happy coding!
 * React Template by Lucas Pelloni
 * Overhauled by Kyrill Hux
 */
const App = () => {
  return (
      <div>
          <AppContextProvider >
            <AppRouter />
          </AppContextProvider>
      </div>
  );
};

export default App;

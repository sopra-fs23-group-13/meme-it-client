import Header from "components/views/Header";
import AppRouter from "components/routing/routers/AppRouter";
import AppContextProvider from "./context";
/**
 * Happy coding!
 * React Template by Lucas Pelloni
 * Overhauled by Kyrill Hux
 */
const App = () => {
  return (
    <AppContextProvider>
      <div>
        <Header height="100" />
        <AppRouter />
      </div>
    </AppContextProvider>
  );
};

export default App;

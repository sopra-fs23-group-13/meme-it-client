import {BrowserRouter, Route, Switch} from "react-router-dom";
import Home from "../../views/Home";
import Lobby from "../../views/Lobby";
import Game from "../../views/Game";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reacttraining.com/react-router/web/guides/quick-start
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
        <Switch>
            <Route path="/lobby">
                <Lobby></Lobby>
            </Route>
            <Route path="/game">
                <Game></Game>
            </Route>
            <Home></Home>
        </Switch>
    </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;

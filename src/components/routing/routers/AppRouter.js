import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import Home from "../../views/Home";
import Lobby from "../../views/Lobby";
import {LobbyGuard} from "../routeProtectors/LobbyGuard";
import {GameGuard} from "../routeProtectors/GameGuard";
import Game from "components/views/Game";
import GameRating from "components/views/GameRating";
import {HomeGuard} from "../routeProtectors/HomeGuard";
import Leaderboard from "components/views/Leaderboard";
import FinalLeaderboard from "components/views/FinalLeaderboard";
import roundRatingsMock from "mockData/Leaderboard/roundRatingsMockData.json"
import roundMemesMock from "mockData/Leaderboard/roundMemesMockData.json"
import gameRatingsMock from "mockData/Leaderboard/gameRatingsMockData.json"





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
          <Route path="/final-leaderboard">
            <FinalLeaderboard leaderboardData={roundRatingsMock}/>
          </Route>
          <Route path="/leaderboard">
            <Leaderboard roundMemes={roundMemesMock} roundRatings={roundRatingsMock} gameRatings={gameRatingsMock}/>
          </Route>
          <Route path="/lobby">
            <LobbyGuard>
              <Lobby/>
            </LobbyGuard>
          </Route>
          <Route path="/game/:id">
            <GameGuard>
              <Game/>
            </GameGuard>
          </Route>
          <Route path="/game-rating/:id">
            <GameGuard>
              <GameRating/>
            </GameGuard>
          </Route>
          <Route path="/game">
            <Redirect to="/"/>
          </Route>
          <HomeGuard>
            <Home/>
          </HomeGuard>
        </Switch>
      </BrowserRouter>
    );
  };
  

/*
 * Don't forget to export your component!
 */
export default AppRouter;
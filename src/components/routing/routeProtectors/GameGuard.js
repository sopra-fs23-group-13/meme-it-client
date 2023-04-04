import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";

/**
 * routeProtectors interfaces can tell the router whether or not it should allow navigation to a requested route.
 * They are functional components. Based on the props passed, a route gets rendered.
 * In this case, if the user is authenticated (i.e., a token is stored in the local storage)
 * {props.children} are rendered --> The content inside the <GameGuard> in the App.js file, i.e. the user is able to access the main app.
 * If the user isn't authenticated, the components redirects to the /login screen
 * @Guard
 * @param props
 */
export const GameGuard = props => {
  //If user has hash in local storage + if lobby with such hash exists atm (backend needs to be fixed first i think)
  if (!localStorage.getItem("hash")){
    return props.children;
  }
  return <Redirect to="/lobby"/>;
};

GameGuard.propTypes = {
  children: PropTypes.node
};
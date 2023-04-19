import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";

/**
 *
 * Another way to export directly your functional component.
 */
export const LobbyGuard = props => {
    if (localStorage.getItem("code") && !localStorage.getItem("started")) {
        return props.children;
    }
    // if user is not in lobby, redirects to home
    return <Redirect to="/"/>;
};

LobbyGuard.propTypes = {
    children: PropTypes.node
}
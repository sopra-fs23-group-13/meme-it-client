import PropTypes from "prop-types";
import React, {useEffect, useState} from "react";
import {Button} from "react-bootstrap";

function simulateNetworkRequest(timeout = 1000){

    return new Promise((resolve) => setTimeout(resolve, timeout));
}
export const LoadingButton = props => {
    LoadingButton.propTypes ={
        onClick: PropTypes.func,
        buttonText: PropTypes.string,
        loadingText: PropTypes.string,
        disabledIf: PropTypes.bool,
        c_name : PropTypes.string,
        loadingTime : PropTypes.number
    }
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if (isLoading) {
            simulateNetworkRequest(props.loadingTime).then(() => {
                setLoading(false);
                props.onClick();
            });
        }
    }, [isLoading]);

    const handleClick = () => setLoading(true);

    return (
        <Button
            className= {props.c_name ? props.c_name : "home join-btn"}
            disabled={isLoading || props.disabledIf}
            onClick={!isLoading ? handleClick : null}
        >
            {isLoading ? props.loadingText : props.buttonText}
        </Button>
    );
}
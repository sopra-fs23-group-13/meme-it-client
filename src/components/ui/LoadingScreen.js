import {Button} from "react-bootstrap";
import {Spinner} from "./Spinner";
import BaseContainer from "./BaseContainer";
import React, {useEffect, useState} from "react";
import Cookies from "universal-cookie";

const LoadingScreen = () => {
    const [loadingTime, setLoadingTime] = useState(0);
    const cookies = new Cookies();
    const leaveGame = async () => {
        localStorage.clear()
        localStorage.setItem("alert", "Disconnected")
        cookies.remove("token")
        history.replace("/")
    }

    useEffect(() => {
        const interval = setInterval(async () => {
            setLoadingTime(loadingTime + 1000)
        }, 1000);
        return () => clearInterval(interval);

    }, [loadingTime])
    return (
        <BaseContainer style={{padding:"1em"}}>
            {loadingTime>6000 ? <p style={{color:"black", marginTop:"1em"}}>
                If you are seeing this screen for more than 10 seconds, please refresh the page.
            </p> : null }
            <Button
                width="200px"
                onClick={leaveGame}
                className="lobby leave-btn game"
            >
                Leave Game
            </Button>
            <div style={{marginTop:"2em", marginBottom:"-1em", alignContent:"center", justifyContent:"center", textAlign:"center"}}>
                <Spinner/>
            </div>
        </BaseContainer>
    )
}

export default LoadingScreen;
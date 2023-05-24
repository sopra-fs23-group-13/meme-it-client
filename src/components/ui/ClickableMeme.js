import React, {useRef, useState} from "react";
import Modal from "react-bootstrap/Modal";
import {Spinner} from "./Spinner";
import PropTypes from "prop-types";
import "styles/views/Leaderboard.scss";
import DraggableResizableInput from "./DraggableInput";

const ClickableMeme = props => {
    const [showMeme, setShowMeme] = useState(false );
    const [dimensions, setDimensions] = useState({ width: 'auto', height: 'auto' });
    const imageRef = useRef();

    ClickableMeme.propTypes = {
        meme: PropTypes.object,
        disableModal: PropTypes.bool, //If you want to disable clicking for some reason
        size: PropTypes.string, //either small (for leaderboard) or large (best meme)
    }

    const classNames = {
        small: "leaderboard list-meme",
        large: "leaderboard special-meme",
    }
    const handleClose = () => setShowMeme(false);
    const handleImageLoad = () => {
        setDimensions({
            width: imageRef.current.offsetWidth,
            height: imageRef.current.offsetHeight
        });
    };
    const ModalMemeImage = () => {
        return (
            <div className="meme-content">
                <div style={{alignItems:"flex-start", justifyContent:"center", height: "400px", width:dimensions.width, position:"relative"}}>
                    <img src={props.meme?.imageUrl} alt={"Meme"} ref={imageRef} onLoad={handleImageLoad} style={{position:"absolute", height: "400px"}}/>
                    {props.meme?.textBoxes?.map((item, i) => (
                        <DraggableResizableInput
                            key={i}
                            inputValue={item.text}
                            color={props.meme?.color}
                            backgroundColor={props.meme?.backgroundColor}
                            initialDimension={{
                                width: item?.width,
                                height: item?.height,
                            }}
                            maxDimension={400}
                            fontSize={item.fontSize}
                            position={{
                                x: item?.xRate,
                                y: item?.yRate,
                            }}
                            isSynchronizing={true}
                        />
                    ))}
                </div>
            </div>
            )
    }

    if(props.size === "small"){
        return (
            <div>
                <img  style={{width:100, cursor:"pointer"}} src={props.meme?.imageUrl} onClick={()=> {
                    setShowMeme(true)
                }}/>
                <Modal
                    show={showMeme}
                    onHide={handleClose}
                    centered
                    size={"sm"}
                >
                    {props.meme ?
                        <ModalMemeImage/>
                        : <div><Spinner/></div>}
                </Modal>
            </div>
        )
    }
}

export default ClickableMeme;
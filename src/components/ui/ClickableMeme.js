import React, {useState} from "react";
import Modal from "react-bootstrap/Modal";
import {Spinner} from "./Spinner";
import PropTypes from "prop-types";
import "styles/views/Leaderboard.scss";
import DraggableResizableInput from "./DraggableInput";

const ClickableMeme = props => {
    const [showMeme, setShowMeme] = useState(false );

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

    const ModalMemeImage = () => {
        return (
            <div className="meme-content">
                <div style={{alignItems:"flex-start", justifyContent:"center", height:"400px",width:"400px", position:"relative"}}>
                    <img src={props.meme?.imageUrl} alt={"Meme"} style={{height:"400px",width:"400px", position:"absolute"}}/>
                    {props.meme?.textBoxes?.map((item, i) => (
                        <DraggableResizableInput
                            key={i}
                            inputValue={item.text}
                            color={props.meme?.color}
                            backgroundColor="transparent"
                            initialDimension={{
                                width: item?.width,
                                height: item?.height,
                            }}
                            maxDimension={400}
                            fontSize={props.meme?.fontSize}
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
                    style={{overflowX:"visible"}}
                >
                    {props.meme ?
                        <ModalMemeImage/>
                        : <div><Spinner/></div>}
                </Modal>
            </div>
        )
    }
    return (
        <div className="meme-content">
            <div className={"drag-content"}>
                <img
                    src={props.meme?.imageUrl}
                    alt={"Meme"}
                    className={classNames[props.size]}
                    onClick={() => { if (!props.disableModal) {setShowMeme(true)}}}
                />
                {props.meme?.textBoxes?.map((item, i) => (
                    <DraggableResizableInput
                        key={i}
                        inputValue={item.text}
                        color={props.meme?.color}
                        backgroundColor="transparent"
                        initialDimension={{
                            width: item?.width,
                            height: item?.height,
                        }}
                        maxDimension={300}
                        fontSize={props.meme?.fontSize}
                        position={{
                            x: item?.xRate,
                            y: item?.yRate,
                        }}
                        isSynchronizing={true}
                    />
                ))}
            </div>
            <Modal
                show={showMeme}
                onHide={handleClose}
                centered
                size="sm"
            >
                <ModalMemeImage/>
            </Modal>
        </div>
    )





}

export default ClickableMeme;
import React, {useState} from "react";
import Modal from "react-bootstrap/Modal";
import {Spinner} from "./Spinner";
import Draggable from "react-draggable";
import PropTypes from "prop-types";
import "styles/views/Leaderboard.scss";
import { useImageSize } from 'react-image-size';
import {Container, ModalBody} from "react-bootstrap";

const ClickableMeme = props => {
    const [showMeme, setShowMeme] = useState(false );
    const [dimensions, { loading, error }] = useImageSize(props.meme.imageUrl);

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

    const ModalMemeImage = ({modalMeme}) => {
        return (
                <div style={{display:"flex", alignItems:"flex-start", justifyContent:"center", position:"relative"}}>
                    <img
                        src={modalMeme?.imageUrl}
                        alt={"Meme"}
                        style={{width:"400px", height:"400px"}}
                    />
                    {modalMeme?.textBoxes?.map((item, i) => (
                        <Draggable
                            key={i}
                            bounds="parent"
                            position={{
                                x: item?.xRate,
                                y: item?.yRate,
                            }}
                            disabled
                        >
                        <textarea
                            placeholder="TEXT HERE"
                            value={item.text}
                            disabled
                            style=
                                {{
                                    fontSize: `${modalMeme?.fontSize}px`,
                                    color: modalMeme?.color,
                                    position: "absolute",
                                    background: "none",
                                    border: "none",
                                    resize: "none",
                                    fontWeight: "750",
                                    minHeight:"40px",
                                    width:"50%",
                                    textAlign: "center",
                                }}
                        />
                        </Draggable>
                    ))}
                </div>
            )
    }

    if(props.size === "small"){
        return (
            <div>
                <img  style={{width:100, cursor:"pointer"}} src={props.meme.imageUrl} onClick={()=> {
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
                        <ModalMemeImage modalMeme={props.meme}/>
                        : <div><Spinner/></div>}
                </Modal>
            </div>
        )
    }
    if(dimensions !== null){
        let x_multiplier = dimensions.height/dimensions.width;
        let y_multiplier = dimensions.width/dimensions.height;
        if(dimensions.width > dimensions.height){
            x_multiplier *= 1.2
            y_multiplier *= 0.5
        }
        else{
            x_multiplier *= 0.7
            y_multiplier *= 0.7
        }

        return (
            <div className="meme-content">
                <img
                    src={props.meme?.imageUrl}
                    alt={"Meme"}
                    className={classNames[props.size]}
                    onClick={() => { if (!props.disableModal) {setShowMeme(true)}}}
                />
                {props.meme?.textBoxes?.map((item, i) => (
                    <Draggable
                        key={i}
                        bounds="parent"
                        position={{
                            x: item?.xRate * x_multiplier,
                            y: item?.yRate * y_multiplier,
                        }}
                        disabled
                    >
                        <textarea
                            placeholder="TEXT HERE"
                            value={item.text}
                            disabled
                            style={{fontSize: `${props.meme?.fontSize*0.9}px`, color: props.meme?.color, width:"50%",resize:"none", textAlign:"center",pointerEvents:"none"}}
                        />
                    </Draggable>
                ))}
                <Modal
                    show={showMeme}
                    onHide={handleClose}
                    centered
                    size="sm"
                >
                    <ModalMemeImage modalMeme={props.meme}/>
                </Modal>
            </div>
        )
    }
    else {
        return (
            <div>
                <Spinner/>
            </div>
        )
    }



}

export default ClickableMeme;
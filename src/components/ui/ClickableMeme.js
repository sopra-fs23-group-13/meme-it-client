import React, {useState} from "react";
import Modal from "react-bootstrap/Modal";
import {Spinner} from "./Spinner";
import Draggable from "react-draggable";
import PropTypes from "prop-types";

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

    const ModalMemeImage = ({modalMeme}) => {
        return (
                <div className="meme-content">
                    <img
                        src={modalMeme?.imageUrl}
                        alt={"Meme"}
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
                            style={{fontSize: `${modalMeme?.fontSize}px`, color: modalMeme?.color}}
                        />
                        </Draggable>
                    ))}
                </div>
            )
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
                        x: item?.xRate,
                        y: item?.yRate,
                    }}
                    disabled
                >
                        <textarea
                            placeholder="TEXT HERE"
                            value={item.text}
                            disabled
                            style={{fontSize: `${props.meme?.fontSize}px`, color: props.meme?.color}}
                        />
                </Draggable>
            ))}
            <Modal show={showMeme} onHide={handleClose}
                style={{height:"100%", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:"0"}}
                show={showMeme}
                onHide={handleClose}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                {props.meme ? <ModalMemeImage modalMeme={props.meme}/>  : <div><Spinner/></div>}
            </Modal>
        </div>

    )



}

export default ClickableMeme;
import React, {useState, useRef, useEffect} from 'react';
import Draggable from 'react-draggable';
import {Resizable} from 're-resizable';

const DraggableResizableInput = ({
                                     index: index,
                                     inputValue: initialValue,
                                     onTextNodeDrag: onTextNodeDrag,
                                     handleFontSizeChange:handleFontSizeChange,
                                     setPropDim: setPropDim,
                                     initialDimension: initialDimension,
                                     onInputChange: handleChange,
                                     color,
                                     backgroundColor,
                                     fontSize: initialFontSize,
                                     position: initialPosition,
                                     isSynchronizing
                                 }) => {
    const [inputValue, setInputValue] = useState(initialValue || '');
    const inputRef = useRef(null);
    const [fontSize, setFontSize] = useState(initialFontSize || '16px');
    const [position, setPosition] = useState(initialPosition || {x: 0, y: 0});
    const [dimensions, setDimensions] = useState(initialDimension || {width: 200, height: 50});

    useEffect(() => {
        if (inputRef.current) {
            if (!isSynchronizing) handleFontSizeChange(undefined, inputRef.current, Math.floor(inputRef.current.offsetHeight * 0.8));
            setFontSize(`${Math.floor(inputRef.current.offsetHeight * 0.8)}px`);
        }
    }, [dimensions]);

    useEffect(() => {
        if (inputRef.current) {
            const scrollWidth = inputRef.current.scrollWidth;
            const clientWidth = inputRef.current.clientWidth;
            if (!isSynchronizing && scrollWidth > clientWidth && scrollWidth <= 400) {
                setDimensions({width: scrollWidth, height: dimensions.height});
                setPropDim(undefined, inputRef.current, {width: scrollWidth, height: dimensions.height})
            }
            // check if the text box goes over the image
            const actualWidth = position.x + scrollWidth;
            if(actualWidth >= 400 && actualWidth-400 < position.x && !isSynchronizing){
                //move object further left
                setPropDim(undefined, inputRef.current, {width: scrollWidth, height: dimensions.height})
                onTextNodeDrag(undefined, {lastX: position.x - (actualWidth-400), lastY: position.y});
                setPosition(prev => ({...prev, x: (prev.x - (actualWidth-400))}));
            }
        }
    }, [inputValue, isSynchronizing]);

    const handleInputChange = (event) => {
        if (inputRef.current && inputRef.current.scrollWidth <= 400) {
            setInputValue(event.target.value);
            if (handleChange) handleChange(event);
        }
    }

    const handleDrag = (event, data) => {
        setPosition({x: data.x, y: data.y});
        onTextNodeDrag(event, data);
    }

    return (
        <Draggable bounds=".drag-content" onDrag={handleDrag} position={position} disabled={isSynchronizing}>
            <Resizable
                size={dimensions}
                onResize={(event, direction, ref) => {
                    if (ref.scrollWidth <= 400) {
                        if (!isSynchronizing) setPropDim(event, ref, {width: ref.offsetWidth, height: ref.offsetHeight});
                        setDimensions({width: ref.offsetWidth, height: ref.offsetHeight});
                    } else {
                        if (!isSynchronizing) setPropDim(event, ref, {width: ref.offsetWidth, height: ref.offsetHeight});
                        setDimensions(prev => ({...prev, height: ref.offsetHeight - 1}));
                    }
                }}
                maxWidth={400}
                maxHeight={50}
                enable={{
                    top: !isSynchronizing,
                    right: !isSynchronizing,
                    bottom: !isSynchronizing,
                    left: !isSynchronizing,
                    topRight: !isSynchronizing,
                    bottomRight: !isSynchronizing,
                    bottomLeft: !isSynchronizing,
                    topLeft: !isSynchronizing
                }}
                id={index}
            >
                <input
                    className={"draggable-resizable-input"}
                    ref={inputRef}
                    style={{
                        fontWeight:'750',
                        width: '100%',
                        height: '100%',
                        fontSize: !isSynchronizing ? fontSize : initialFontSize,
                        padding: '10px',
                        boxSizing: 'border-box',
                        color: color,
                        background: backgroundColor,
                        border: !isSynchronizing ? '1px solid black' : 'none',
                        textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'
                    }}
                    id={index}
                    value={inputValue}
                    onChange={handleInputChange}
                    disabled={isSynchronizing}
                />
            </Resizable>
        </Draggable>
    );
};

export default DraggableResizableInput;

import React, { useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import "styles/ui/AutoSizeTextArea.scss";

function AutoSizeTextArea({ value, onChange, onDrag, style, maxDimension, fontSize, disabled, position }) {
    const textAreaRef = useRef(null);

    const fontSizeToWidthFactor = {
        10: 1.1,
        11: 1.1,
        12: 1.1,
        13: 1.1,
        14: 1,
        15: 1,
        16: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        21: 1,
        22: 1,
        23: 1,
        24: 1,
        25: 1,
        26: 1,
        27: 1,
        28: 1,
        29: 1,
        30: 1
    };

    useEffect(() => {
        // Get the width factor for the current font size
        if (textAreaRef.current.value.length > 0){
            const widthFactor = fontSizeToWidthFactor[fontSize];
            textAreaRef.current.style.height = "auto";
            textAreaRef.current.style.height = `${Math.min(textAreaRef.current.scrollHeight, maxDimension)}px`;
            textAreaRef.current.style.width = "auto";
            const max = Math.max(0,...textAreaRef.current.value.split("\n").map(s=>s.length));
            textAreaRef.current.style.width = `${Math.min(fontSize * widthFactor * max, maxDimension)}px`;
        } else {
            textAreaRef.current.style.height = "auto";
            textAreaRef.current.style.width = "auto";
        }
    }, [value]);

    const onKeyPress = (e) => {
        if (textAreaRef.current.scrollHeight >= maxDimension && e.key === 'Enter') {
            e.preventDefault();
        }
    };

    return (
        <Draggable
            bounds="parent"
            position={position}
            onDrag={onDrag}
            disabled={disabled}
        >
        <textarea
            className="auto-size-text-area"
            ref={textAreaRef}
            placeholder={"TEXT NODE"}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyPress}
            rows={1}
            style={{
                ...style,
                fontFamily: 'monospace',
                overflow: 'hidden',
                resize: 'none',
                maxWidth: `${maxDimension}px`,
                maxHeight: `${maxDimension}px`,
                fontSize: `${fontSize}px`,
            }}
            disabled={disabled}
        />
        </Draggable>
    );
}

export default AutoSizeTextArea;
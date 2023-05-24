import DraggableResizableInput from "./DraggableInput";
import {useEffect, useRef, useState} from "react";

const CarouselItemContent= ({ currentMeme }) => {
    const imageRef = useRef();
    const [dimensions, setDimensions] = useState({ width: 'auto', height: 'auto' });

    useEffect(() => {
        const img = new Image();
        img.src = currentMeme?.imageUrl;
        img.onload = () => {
            const originalWidth = img.width;
            const originalHeight = img.height;
            const ratio = originalWidth / originalHeight;

            const newHeight = 400;
            const newWidth = newHeight * ratio;

            setDimensions({
                width: `${newWidth}px`,
                height: `${newHeight}px`,
            });
        };
    }, [currentMeme?.imageUrl]);

    return (
        <div className="meme-content">
            <div className={"drag-content"} style={dimensions}>
                <img src={currentMeme?.imageUrl} alt={"Meme"} ref={imageRef} />
                {currentMeme?.textBoxes?.map((item, i) => (
                    <DraggableResizableInput
                        key={i}
                        inputValue={item.text}
                        color={currentMeme?.color}
                        backgroundColor={currentMeme?.backgroundColor}
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
    );
}
export default CarouselItemContent;
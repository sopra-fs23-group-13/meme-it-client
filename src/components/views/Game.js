import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import "styles/views/Game.scss";
import {Button, Col, Container, Row, Stack} from "react-bootstrap";
import MockData from "../../mockData/memeFetchMockData.json"
import {FormField} from "../../helpers/formField";


const Game = () => {
    const [meme, setMeme] = useState(null);
    const [textBoxes, setTextBoxes] = useState([]);

    const handleMouseDown = (index, event) => {
        const {pageX, pageY} = event;
        const newTextBoxes = [...textBoxes];
        newTextBoxes[index].isDragging = true;
        newTextBoxes[index].dragStartX = pageX;
        newTextBoxes[index].dragStartY = pageY;
        setTextBoxes(newTextBoxes);
    };

    const addTextbox = () => {
        const boxes = [...textBoxes];
        boxes.push({x: 100, y: 100, text: ''});
        setTextBoxes(boxes);
    }

    const removeTextbox = () => {
        const boxes = [...textBoxes];
        boxes.pop();
        setTextBoxes(boxes);
    }

    const handleMouseMove = (index, event) => {
        const {pageX, pageY} = event;
        const newTextBoxes = [...textBoxes];
        if (newTextBoxes[index].isDragging) {
            newTextBoxes[index].x += pageX - newTextBoxes[index].dragStartX;
            newTextBoxes[index].y += pageY - newTextBoxes[index].dragStartY;
            newTextBoxes[index].dragStartX = pageX;
            newTextBoxes[index].dragStartY = pageY;
            setTextBoxes(newTextBoxes);
        }
    };

    const handleMouseUp = (index) => {
        const newTextBoxes = [...textBoxes];
        newTextBoxes[index].isDragging = false;
        setTextBoxes(newTextBoxes);
    };

    const handleTextChange = (event) => {
        const { placeholder, value } = event.target;
        const newTextBoxes = [...textBoxes];
        newTextBoxes[placeholder.split(" ")[1]].text = value;
        setTextBoxes(newTextBoxes);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                fetchMeme();
            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }

        fetchData();
    }, []);

    const fetchMeme = () => {
        setMeme(MockData.data.memes[Math.floor(Math.random() * MockData.data.memes.length)])
    }
    let content = <Spinner/>;

    if (meme) {
        content = (
            <Container>
                <Row>
                    <Col className={"game gameScreen"}>
                        <img src={meme.url} style={{width: "inherit", height: meme.height >= 500 ? 500 : "inherit"}} className={"game meme"} alt="Current meme to display"/>
                        {textBoxes.map((textBox, index) => (
                            <div
                                key={index}
                                className={"game textbox_flex"}
                                style={{
                                    left: `${textBox.x}px`,
                                    top: `${textBox.y}px`,
                                }}
                                onMouseDown={(event) => handleMouseDown(index, event)}
                                onMouseMove={(event) => handleMouseMove(index, event)}
                                onMouseUp={() => handleMouseUp(index)}
                            >
                                <FormField
                                    placeholder={"Textbox " + index}
                                    value={textBox.text}
                                    name="text"
                                    id={index}
                                    label={"Textbox " + index}
                                    onChange={handleTextChange}
                                />
                            </div>
                        ))}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button onClick={fetchMeme}>
                            Swap meme
                        </Button>
                        <Button onClick={addTextbox}>
                            Add new Textbox
                        </Button>
                        <Button onClick={removeTextbox}>
                            Remove the most recent Textbox
                        </Button>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container className={"home content"}>
            <Stack gap={3}>
                <Row>
                    <Container>
                        <Row>
                            <Col className={"col-3"}>{/*placeholder*/}</Col>
                            <Col className={"col-6"}>
                                <Stack gap={3}>
                                    <Row>
                                        {content}
                                    </Row>
                                </Stack>
                            </Col>
                            <Col className={"col-3"}>{/*placeholder*/}</Col>
                        </Row>
                    </Container>
                </Row>
            </Stack>
        </Container>
    );
}

export default Game;

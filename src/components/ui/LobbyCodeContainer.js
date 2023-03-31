import {Col, Container, Row} from "react-bootstrap";
import "styles/ui/LobbyCodeContainer.scss";
import {FiCopy} from "react-icons/fi"
const hash = "yellow-mountain";

const LobbyCodeContainer = () => {
    return (
        <Container className="LobbyCodeContainer container">
            <div className="LobbyCodeContainer inner-container">
                <Row>Lobby Code:</Row>
                <Row>
                    {hash}
                    <Col>
                        <FiCopy/>
                    </Col>
                </Row>

            </div>
        </Container>
    )
}

export default LobbyCodeContainer;
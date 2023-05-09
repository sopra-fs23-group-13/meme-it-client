import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {FaCopy} from "react-icons/fa";

export const LobbyCodeContainer = ({code}) => {
    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(code);
    };
    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Copy to clipboard
        </Tooltip>
    );
    return (
        <div className="lobby card">
            <h2 className="lobby-code-heading">Lobby Code:</h2>
            <div className="lobby-code">
                <span className="lobby-code-text">{code}</span>
                <OverlayTrigger
                    placement="left"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip}
                >
                      <span
                          className="copy-icon"
                          onClick={copyToClipboard}
                          title="Copy to clipboard"
                      >
                    <FaCopy />
                  </span>
                </OverlayTrigger>
            </div>
        </div>

    )
}
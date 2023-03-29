import PropTypes from "prop-types";
import {Button, Form, InputGroup} from "react-bootstrap";

export const FormField = props => {
    FormField.propTypes = {
        label: PropTypes.string,
        value: PropTypes.string,
        onChange: PropTypes.func,
        action: PropTypes.func
    };

    return (

        <InputGroup className="mb-3">
            <Form.Control
                type={props.type}
                aria-label={props.name}
                aria-describedby="basic-addon2"
                placeholder={props.placeholder}
                value={props.value}
                name={props.name}
                onChange={e => props.onChange(e)}
            />
            {props.action &&
            <Button variant="outline-secondary" onClick={() => props.action()}>
                Join Game
            </Button>}
        </InputGroup>
    );
};
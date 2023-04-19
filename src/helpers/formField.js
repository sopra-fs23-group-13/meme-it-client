import PropTypes from "prop-types";
import {Form, InputGroup} from "react-bootstrap";
import UsernameModal from "../components/views/UsernameModal";
import React from "react";

export const FormField = props => {
    FormField.propTypes = {
        label: PropTypes.string,
        value: PropTypes.string,
        onChange: PropTypes.func,
        action: PropTypes.func,
        c_names: PropTypes.string
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
                c_names = {props.c_names}
            />
            {props.action &&
                <UsernameModal c_names={props.c_names} title={"Join Game"} submit={props.action} code={props.code}/>
            }
        </InputGroup>
    );
};
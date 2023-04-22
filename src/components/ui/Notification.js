import React from "react";
import { Toast } from "react-bootstrap";
import { IoMdAlert } from "react-icons/io";

export const Notification = ({ reason, showAlert, toggleShowAlert }) => {
    return (
        <Toast
            bg={"white"}
            show={showAlert}
            delay={5000}
            autohide
            onClose={() => {
                toggleShowAlert();
                sessionStorage.removeItem("alert");
            }}
        >
            <Toast.Header>
                <strong className="me-auto">
                    {" "}
                    <IoMdAlert /> Alert
                </strong>
            </Toast.Header>
            <Toast.Body className="me-auto">
                <b>{reason}</b>
            </Toast.Body>
        </Toast>
    );
};
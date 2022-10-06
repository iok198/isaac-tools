import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";

export default function Blank(props) {
    const show = props.show;
    const handleClose = props.handleClose;
    const id = props.id;
    
    const [errMessage, setErrMessage] = useState(null);

    const submit = async (e) => {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(e.target));
        const response = await fetch(`/api/sentence/word/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });
        const result = await response.json();
        if (!response.ok) {
            setErrMessage(result.message);
        }
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
        <Form onSubmit={submit}>
            <Modal.Header closeButton>
            <Modal.Title>Are you sure you want to delete this word?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {errMessage && <Alert variant="danger">{errMessage}</Alert>}
                You will be permanently deleting this word, are you sure you want to continue?
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="danger" type="submit">
                Delete
            </Button>
            </Modal.Footer>
        </Form>
      </Modal>
    );
}

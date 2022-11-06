import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";

export default function Blank(props) {
    const show = props.show;
    const handleClose = props.handleClose;
    const updateUser = props.updateUser;
    const [isRegister, setIsRegister] = useState(false);
    const [errMessage, setErrMessage] = useState(null);
    const title = isRegister ? "Register" : "Login";
    const bottomText = isRegister ? "Have an account?" : "Don't have an account?";

    const submit = async (e) => {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(e.target));
        if (isRegister) {
            if (formData.password !== formData.confirmedPassword) {
                setErrMessage("Passwords do not match")
                return;
            }

            const response = await fetch("/api/user/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            const result = await response.json();

            if (!response.ok) {
                setErrMessage(result.message);
                return;
            }

            updateUser(result);
        } else {
            const response = await fetch("/api/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            const result = await response.json();

            if (!response.ok) {
                setErrMessage(result.message);
                return;
            }

            updateUser(result);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
        <Form onSubmit={submit}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {errMessage && <Alert variant="danger">{errMessage}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Type your username here"
                name="username"
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Type your password here"
                name="password"
              />
            </Form.Group>
            {isRegister && <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password here"
                name="confirmedPassword"
              />
            </Form.Group>}
          
        </Modal.Body>
        <Modal.Footer>
            <span>{bottomText} <a href="#" onClick={() => setIsRegister(!isRegister)}>{isRegister ? "Login" : "Register"}</a></span>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            {title}
          </Button>
        </Modal.Footer>
        </Form>
      </Modal>
    );
}

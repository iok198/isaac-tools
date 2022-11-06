import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";

export default function Blank(props) {
    const show = props.show;
    const handleClose = props.handleClose;
    const [errMessage, setErrMessage] = useState(null);
    const [word, setWord] = useState(null);

    useEffect(() => {
        const word = JSON.parse(JSON.stringify(props.word));
        setWord(word);
    }, [props.word]);

    const submit = async (e) => {
        e.preventDefault();
        setErrMessage(null);
        const response = await fetch(`/api/sentence/${word.id ? "word/" + word.id : "add"}`, {
            method: word.id ? "PUT" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(word)
        });
        const result = await response.json();
        if (!response.ok) {
            setErrMessage(result.message);
        }
        console.log(result);
        handleClose();
    };
    console.log(word);
    return (
        <Modal show={show} onHide={handleClose}>
            {!!word && <Form onSubmit={submit}>
                <Modal.Header closeButton>
                    <Modal.Title>{word.id ? "Edit" : "New Entry"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errMessage && <Alert variant="danger">{errMessage}</Alert>}
                    <Form.Group className="mb-3">
                        <Form.Label>Word</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Type word here"
                            defaultValue={word.text}
                            autoFocus
                            onChange={(e) => {
                                word.text = e.target.value;
                            }}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Definition</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Type definition here"
                            defaultValue={word.definition}
                            onChange={(e) => {
                                word.definition = e.target.value;
                            }}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Sentence</Form.Label>
                        {word.sentences.map((sentence, i) => <>
                            {i !== 0 && <hr />}
                            <Form.Control
                                type="text"
                                placeholder="Type sentence here"
                                defaultValue={sentence.text}
                                className="mb-3"
                                onChange={(e) => {
                                    sentence.text = e.target.value;
                                }}
                            />
                            <Form.Control
                                type="text"
                                placeholder="Type source here"
                                defaultValue={sentence.source}
                                name="source"
                                className="mb-3"
                                onChange={(e) => {
                                    sentence.source = e.target.value;
                                }}
                            />
                            <Form.Control
                                type="text"
                                placeholder="Paste link here"
                                defaultValue={sentence.link}
                                className="mb-3"
                                onChange={(e) => {
                                    sentence.link = e.target.value;
                                }}
                            />
                            <Form.Control
                                type="text"
                                placeholder="Type notes here"
                                defaultValue={sentence.notes}
                                className="mb-3"
                                onChange={(e) => {
                                    sentence.notes = e.target.value;
                                }}
                            />
                        </>)}
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit">
                        {word.id ? "Save Changes" : "Add"}
                    </Button>
                </Modal.Footer>
            </Form>}
      </Modal>
    );
}

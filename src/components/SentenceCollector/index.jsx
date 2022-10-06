import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";

import "../../bi/bootstrap-icons.css";

import WordModal from "../WordModal";
import DeleteWordModal from "../DeleteWordModal";

export default function Blank() {
    const [words, setWords] = useState([]);
    const [sentence, setSentence] = useState("");
    const [currentWord, setCurrentWord] = useState(null);
    const [wordList, setWordList] = useState([]);
    const [id, setId] = useState(null);
    const [showDelete, setShowDelete] = useState(false);
    const [wordIdMapping, setWordIdMapping] = useState({});
    const [alertMessage, setAlertMessage] = useState({});
    const [showAlert, setShowAlert] = useState();
    const [showSentenceAdder, setShowSentenceAdder] = useState(false);

    const load = async () => {
        const response = await fetch("/api/sentence/all");
        if (response.ok) {
            const list = await response.json();
            setWordList(list);
        }
    };

    useEffect(() => {load()}, []);

    const submit = async (e) => {
        e.preventDefault();
        const sentence = Object.fromEntries(new FormData(e.target));
        setSentence(sentence);
        console.log("form data", sentence);
        const resp = await fetch("https://kotu.io/api/dictionary/parse", {
            method: "POST",
            body: sentence.text
        });
        const sentences = await resp.json(); 
        const components = sentences.flatMap(s => s.accentPhrases).flatMap(p => p.components);

        const wordsResp = await fetch("/api/sentence/exists", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(components.map(component => component.original))
        });
        const wordList = await wordsResp.json();

        setWords(components);
        setWordIdMapping(wordList);
    };

    const handleWord = async (word) => {
        console.log(word);
        if (wordIdMapping[word.original]) {
            const response = await fetch("/api/sentence/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: word.original,
                    sentences: [sentence]
                })
            });
            const result = await response.json();
            setShowAlert(true);
            if (!response.ok) {
                setAlertMessage({ type: "danger", message: result.message });
            } else {
                setAlertMessage({ type: "success", message: "Added sentence to word" });
            }
        } else {
            setCurrentWord({
                text: word.original,
                definition: "",
                sentences: [sentence]
            });
        }
    };

    const AnalyzedSentence = () => {
        if (words.length > 0) {
            return <ButtonGroup className="mb-3">
                {words.map((word, i) => 
                    <Button 
                        key={i} 
                        variant={wordIdMapping[word.original] ? "outline-success" : "outline-primary"} 
                        onClick={() => handleWord(word)}>{word.surface}</Button>)
                }
            </ButtonGroup>;
        }
        return <></>;
    };

    const SentenceContent = (props) => {
        const sentence = props.sentence;
        const [open, setOpen] = useState(false);
        return <div>
            <div className="d-flex justify-content-between">
                <div>
                    {sentence.text}
                    {(sentence.source || sentence.link) && <a href={sentence.link ? sentence.link : ""} target="_blank" className="ms-1"><Badge>{sentence.source ? sentence.source : "Source"}</Badge></a>}
                </div>
                {sentence.notes && <span onClick={() => setOpen(!open)} className={`cursor-pointer bi bi-chevron-${open ? "down" : "right"}`}></span>}
            </div>
            {open && <>
                <hr className="mb-1 mt-2"/>
                {sentence.notes}
            </>}
        </div>
    };

    const CurrentEntries = () => {
        if (wordList.length > 0) {
            return <Container>
                <Row>
                {wordList.map((entry, i) => 
                    <Col xs={6}>
                        <Card className="mb-3">
                            <Card.Body key={i}>
                                <Card.Title>{entry.text}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{entry.definition || "N/A"}</Card.Subtitle>
                                <Card.Text>
                                    <ListGroup>
                                        {entry.sentences.map((sentence, j) => <ListGroup.Item key={j}>
                                            <SentenceContent sentence={sentence} />
                                        </ListGroup.Item>)}
                                    </ListGroup>
                                </Card.Text>
                                <Button variant="primary" className="me-2" onClick={() => {
                                    setCurrentWord(entry);
                                    setId(entry.id);
                                }}>Edit</Button>
                                <Button variant="danger" onClick={() => {
                                    setId(entry.id);
                                    setShowDelete(true);
                                }}>Delete</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
                </Row>
            </Container>;
        }
        return <></>
    }
    
    return (
        <div className="mx-3">
            <WordModal 
                show={!!currentWord} 
                handleClose={() => {
                    setId(null);
                    setCurrentWord(null);
                    load();
                }} 
                word={currentWord}
                id={id}/>
            <DeleteWordModal 
                show={showDelete}
                handleClose={() => {
                    setShowDelete(false);
                    setId(null);
                    load();
                }}
                id={id}/>
            <h1 className="d-flex justify-content-between my-3">単語帳 <Button variant="primary" onClick={() => setShowSentenceAdder(!showSentenceAdder)}>Toggle Card Adder</Button></h1>
            {showAlert && <Alert variant={alertMessage.type} onClose={() => setShowAlert(false)} dismissible>{alertMessage.message}</Alert>}
            {showSentenceAdder && <Form onSubmit={submit}>
                {/* <InputGroup className="mb-3"> */}
                    <Form.Control
                        className="mb-3"
                        type="text"
                        placeholder="Paste sentence here"
                        name="text"
                        autoFocus
                    />
                    <InputGroup className="mb-3"> 
                        <Form.Control
                            type="text"
                            placeholder="Paste source here"
                            name="source"
                        />
                        <Form.Control
                            type="text"
                            placeholder="Paste link here"
                            name="link"
                        />
                        <Form.Control
                            type="text"
                            placeholder="Type notes here"
                            name="notes"
                        />
                    </InputGroup>
                    <div className="d-grid gap-2 mb-3">
                        <Button variant="primary" type="submit">Submit</Button>
                    </div>
                {/* </InputGroup> */}
            </Form>}
            {<AnalyzedSentence />}
            {<CurrentEntries />}
        </div>
    );
}

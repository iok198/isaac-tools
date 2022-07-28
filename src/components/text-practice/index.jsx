import React, { useState } from "react";
import styles from "./text-practice.module.css";

function ReplacedText(props) {
    const result = props.shouldReplace ? props.replacedText : props.original;
    return <span onClick={ () => props.click() }>{ result }</span>;
}

function TextPractice(props) {
    const [topWord, setTopWord] = useState("");

    return (
        <div>
            <h1 className={styles.topWord}>{topWord}</h1>
            <p className={styles.practiceText}>{ props.components.map(word => {
                let shouldReplace = false;
                let replacedText = "";

                if (props.shouldReplace === "kanji") {
                    shouldReplace = word.surface !== word.kana;
                    replacedText = <span dangerouslySetInnerHTML={{__html: word.ruby.replace(/[\u3400-\u4DB5\u4E00-\u9FCB\uF900-\uFA6A]/g, "〇")}}></span>;
                } else if (props.shouldReplace === "particle") {
                    shouldReplace = word.partOfSpeech === "助詞";
                    replacedText = "〇";
                }
                console.log(`${word.surface} - ${shouldReplace} - ${shouldReplace ? word.surface : topWord}`);
                return <ReplacedText 
                    click={() => {
                        console.log(`${word.surface} - ${shouldReplace} - ${shouldReplace ? word.surface : topWord}`);
                        if (shouldReplace) {
                            setTopWord(word.surface);
                        }
                    }} 
                    original={word.surface}
                    shouldReplace={shouldReplace}
                    replacedText={replacedText}/>
                }) }
            </p> 
        </div> 
    );
}

export default function Blank() {
    const [text, setText] = useState("");
    const [filter, setFilter] = useState("");
    const [components, setComponents] = useState([]);
    const [replacedText, setReplacedText] = useState("");

    return (
        <div className="mx-3">
            <h1>Japanese Text Practice</h1>
            <input type="text" className="form-control mb-3" onChange={(e) => setText(e.target.value)}/>
            <button className="btn btn-primary mb-3" onClick={async () => {
                const resp = await fetch("https://kotu.io/api/dictionary/parse", {
                    method: "POST",
                    body: text
                });
    
                const sentences = await resp.json(); 
                const components = sentences.flatMap(s => s.accentPhrases).flatMap(p => p.components);
                console.log("Main called");
                setComponents(components);
                setFilter("kanji");
            }}>Kanji Practice</button>
            <button className="btn btn-success mb-3 ml-2" onClick={async () => {
                const resp = await fetch("https://kotu.io/api/dictionary/parse", {
                    method: "POST",
                    body: text
                });
    
                const sentences = await resp.json(); 
                const components = sentences.flatMap(s => s.accentPhrases).flatMap(p => p.components);

                setComponents(components);
                setFilter("particle");
            }}>Particle Practice</button>
            <TextPractice 
                components={ components }
                shouldReplace={ filter }
                replacedText={ replacedText }/>
        </div>
    );
}

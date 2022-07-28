import React, { useState } from "react";
import Youtube from 'react-youtube';
import MusicNoteUtilities from "@rharel/music-note-utils";

const Note = MusicNoteUtilities.Note;

function getFrequencyFromBucket(sampleRate, numberOfBuckets, bucket) {
    const nyquestFreq = sampleRate / 2;
    const frequencyIncrement = nyquestFreq / numberOfBuckets;
    const lowFrequency = frequencyIncrement * bucket;
    const highFrequency = lowFrequency + frequencyIncrement;

    return (lowFrequency + highFrequency) / 2;
}

function NoteList(props) {
    return (
        <>
            <ul class="list-group">
                {props.notes.map(note => <li class="list-group-item">{note[0]} - {note[1]}</li>)}
            </ul>
        </>
    );
}

function TimeStamps(props) {
    return (
        <>
            <p><span class="badge badge-primary">Start</span> {props.start && props.start.toFixed(2)}</p>
            <p><span class="badge badge-primary">End</span> {props.end && props.end.toFixed(2)}</p>
        </>
    )
}

export default function Blank() {
    
    // 2g811Eo7K8U
    const [videoID, setVideoID] = useState("");
    const [youtubePlayer, setYoutubePlayer] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [notes, setNotes] = useState([]);

    return (
        <div id="mainContent" className="mx-3">
            <h1>Note Grabber</h1>
            <input type="text" className="form-control mb-3" onChange={(e) => { setVideoID(e.target.value) }}/>
            <Youtube videoId={videoID} onReady={(e) => { setYoutubePlayer(e.target) }}/>
            <button className="btn btn-danger mb-3" onMouseDown={(e) => { setStartTime(youtubePlayer.getCurrentTime()) }} onMouseUp={(e) => { setEndTime(youtubePlayer.getCurrentTime()) }}>
                Record
            </button>
            <TimeStamps start={startTime} end={endTime} videoID={videoID}/>
            <button class="btn btn-primary mb-3" onClick={async () => {
                const audio = new Audio();
                audio.src = `/api/clip?videoID=${videoID}&start=${startTime}&end=${endTime}`;
                audio.play();
            }}>Review Clip</button>
            <button class="btn btn-success mb-3" onClick={async () => {
                const audio = new Audio();
                audio.src = `/api/clip?videoID=${videoID}&start=${startTime}&end=${endTime}`;
                audio.load();
                audio.play();
                
                const context = new(window.AudioContext || window.webkitAudioContext)();
                
                const source = context.createMediaElementSource(audio);
                const analyser = context.createAnalyser();
                source.connect(analyser);
                analyser.connect(context.destination);

                analyser.fftSize = 2048 * 16;
                const bufferLength = analyser.frequencyBinCount;
                let data = [];
                let secondTry = [];
                const dataArray = new Uint8Array(bufferLength);

                const interval = setInterval(() => {
                    analyser.getByteFrequencyData(dataArray);
                    console.log(dataArray.filter(val => val > 0).length);

                    for (const [bucket, volume] of dataArray.entries()) {
                        if (data[bucket]) {
                            data[bucket].volume += volume;
                        } else {
                            data[bucket] = { bucket, volume };
                        }
                    }
                }, 50);

                audio.addEventListener("ended", () => {
                    clearInterval(interval);
                    data.sort((a, b) => b.volume - a.volume);
                    secondTry.sort((a, b) => b.volume - a.volume);
                    console.log(data);
                    console.log(context.sampleRate, bufferLength, data[0]);
                    let topNotes = {};

                    for (let i = 0; i < 20; i++) {
                        const topFrequency = getFrequencyFromBucket(context.sampleRate, bufferLength, data[i].bucket);
                        const topNote = Note.from_frequency(topFrequency);
                        console.log(`Original ${i + 1}. ${topFrequency} - ${topNote.to_string()} & ${data[i].volume}`);

                        if (!topNotes[topNote.to_string()]) {
                            topNotes[topNote.to_string()] = data[i].volume;
                        } else {
                            topNotes[topNote.to_string()] += data[i].volume;
                        }
                    }

                    setNotes(Object.entries(topNotes).sort((a, b) => b[1] - a));
                });
                
            }}>Analyze Clip</button>
            <NoteList notes={notes} />
        </div>
    );
}

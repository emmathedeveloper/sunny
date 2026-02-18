// import Groq from "groq-sdk";

import { createAudioStreamFromText } from "./tts";


export const upgradeConnection = (req: Request, server: Bun.Server<undefined>) => {
    const upgraded = server.upgrade(req);

    return upgraded;
}

export const handleMessage = (ws: Bun.ServerWebSocket, message: string | Buffer) => {
    console.log("Client sent message", message);

    if (typeof message === "string") {
        handleTextMessage(ws, message);
    } else {
        handleAudioMessage(ws, message);
    }
}

async function handleTextMessage(ws: Bun.ServerWebSocket, message: string) {
    const data = JSON.parse(message);

    if (data.type === "speak") {
        ws.send(JSON.stringify({ type: "speech_action" , payload: { audio: data.payload.text , speechActions: data.payload.speechActions } }))
    }  if (data.type === "transcript") {
        ws.send(JSON.stringify({ type: "transcription_result", payload: { text: data.payload.text } }));
    } 
    else {
        ws.send(JSON.stringify({ type: "error", message: "Unknown message type" }));
    }
}

async function handleAudioMessage(ws: Bun.ServerWebSocket, message: Buffer) {
    const audio = new Int16Array(message);

    console.log("Received audio samples:", audio.length);

    // ws.send(JSON.stringify({ type: "transcription_result", transcription }));
}
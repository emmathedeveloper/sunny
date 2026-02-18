


declare global {
    interface Window {
        __env__: Record<string, string>;
    }

    type WebSocketMessageType = "speak" | "transcript" | "start_conversation" | "error" | "transcription_result";

    type WebSocketMessage<T extends WebSocketMessageType> = {
        type: T;
        payload?: T extends "speak" ? {
            text: string;
        } : T extends "transcript" ? {
            text: string;
        } : T extends "error" ? string : T extends "transcription_result" ? { transcription: string } : never;
        [key: string]: any;
    };
}
import { useEffect, useRef, useState } from "react";


type UseAppWebSocketOptions = {
    url?: string;
    onOpen?: (event: Event) => void;
    onMessage?: (event: MessageEvent) => void;
    onBinaryMessage?: (data: ArrayBuffer) => void;
    onClose?: (event: CloseEvent) => void;
    onError?: (event: Event) => void;
}


export default function useAppWebSocket({
    url = "ws://localhost:3000/ws",
    onOpen,
    onMessage,
    onBinaryMessage,
    onClose,
    onError,
} : UseAppWebSocketOptions = {}) {

    const socket = useRef<WebSocket>(new WebSocket(url));

    const [isConnected, setIsConnected] = useState(false);

    socket.current.onopen = (event) => {
        console.log("WebSocket connection established");
        onOpen?.(event);
        setIsConnected(true);
    };

    socket.current.onmessage = (event) => {
        if (event.data instanceof ArrayBuffer) {
            console.log("Received binary message:", event.data);
            onBinaryMessage?.(event.data);
        } else {
            onMessage?.(event);
        }
    };

    socket.current.onclose = (event) => {
        console.log("WebSocket connection closed");
        onClose?.(event);
        setIsConnected(false);
    };

    socket.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        onError?.(error);
        setIsConnected(false);
    };

    const sendMessage = (message: any) => {
        if (socket.current.readyState === WebSocket.OPEN) {
            socket.current.send(JSON.stringify(message));
        } else {
            console.warn("WebSocket is not open. Unable to send message:", message);
        }
    }

    useEffect(() => {
        socket.current.binaryType = "arraybuffer";

        return () => {
            socket.current.close();
        }
    }, [url]);

    return { socket , sendMessage, isConnected };
}
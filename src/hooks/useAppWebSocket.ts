import { useCallback, useEffect, useRef, useState } from "react";

const DEV = typeof process !== "undefined" && process.env.NODE_ENV === "development";

type UseAppWebSocketOptions = {
    url?: string;
    onOpen?: (event: Event) => void;
    onMessage?: (event: MessageEvent) => void;
    onBinaryMessage?: (data: ArrayBuffer) => void;
    onClose?: (event: CloseEvent) => void;
    onError?: (event: Event) => void;
};

export default function useAppWebSocket({
    url = "ws://localhost:3000/ws",
    onOpen,
    onMessage,
    onBinaryMessage,
    onClose,
    onError,
}: UseAppWebSocketOptions = {}) {
    const socketRef = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    const onOpenRef = useRef(onOpen);
    const onMessageRef = useRef(onMessage);
    const onBinaryMessageRef = useRef(onBinaryMessage);
    const onCloseRef = useRef(onClose);
    const onErrorRef = useRef(onError);
    onOpenRef.current = onOpen;
    onMessageRef.current = onMessage;
    onBinaryMessageRef.current = onBinaryMessage;
    onCloseRef.current = onClose;
    onErrorRef.current = onError;

    useEffect(() => {
        const ws = new WebSocket(url);
        ws.binaryType = "arraybuffer";

        ws.onopen = (event) => {
            if (DEV) console.log("WebSocket connection established");
            setIsConnected(true);
            onOpenRef.current?.(event);
        };

        ws.onmessage = (event) => {
            if (event.data instanceof ArrayBuffer) {
                if (DEV) console.log("Received binary message:", event.data);
                onBinaryMessageRef.current?.(event.data);
            } else {
                onMessageRef.current?.(event);
            }
        };

        ws.onclose = (event) => {
            if (DEV) console.log("WebSocket connection closed");
            setIsConnected(false);
            onCloseRef.current?.(event);
        };

        ws.onerror = (error) => {
            if (DEV) console.error("WebSocket error:", error);
            setIsConnected(false);
            onErrorRef.current?.(error);
        };

        socketRef.current = ws;
        return () => {
            ws.close();
            socketRef.current = null;
        };
    }, [url]);

    const sendMessage = useCallback((message: { type: string; payload?: unknown }) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(message));
        } else if (DEV) {
            console.warn("WebSocket is not open. Unable to send message:", message);
        }
    }, []);

    return { socket: socketRef, sendMessage, isConnected };
}

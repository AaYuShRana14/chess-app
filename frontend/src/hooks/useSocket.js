import { useEffect, useState, useRef, useCallback } from "react";

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const reconnectInterval = useRef(null);
  const reconnectAttempts = useRef(0);

  const connect = useCallback(() => {
    const token = localStorage.getItem("chess-app-token");
    if (token === null) {
      window.location.href = "/signin";
      return;
    }

    const ws = new WebSocket(`ws://https://chess-app-lhi0.onrender.com?token=${token}`);

    ws.onopen = () => {
      console.log("Connected");
      setSocket(ws);
      reconnectAttempts.current = 0;
      if (reconnectInterval.current) {
        clearTimeout(reconnectInterval.current);
        reconnectInterval.current = null;
      }
    };

    ws.onclose = () => {
      console.log("Disconnected");
      setSocket(null);
      if (!reconnectInterval.current) {
        reconnect();
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
      ws.close();
    };

    return ws;
  }, []);

  const reconnect = useCallback(() => {
    if (reconnectAttempts.current < 5) {
      reconnectInterval.current = setTimeout(() => {
        console.log("Reconnecting...");
        reconnectAttempts.current += 1;
        connect();
      }, 3000);
    } else {
      console.log("Max reconnect attempts reached");
    }
  }, [connect]);

  useEffect(() => {
    const ws = connect();

    return () => {
      if (reconnectInterval.current) {
        clearTimeout(reconnectInterval.current);
      }
      if (ws) {
        ws.close();
      }
    };
  }, [connect, reconnect]);

  return socket;
};

import { useEffect, useState, useRef } from "react";

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const reconnectInterval = useRef(null);
  const reconnectAttempts = useRef(0);

  useEffect(() => {
    const token = localStorage.getItem('chess-app-token');
    if (token === null) {
      window.location.href = '/signin';
      return;
    }

    const connect = () => {
      const ws = new WebSocket(`ws://localhost:8080?token=${token}`);

      ws.onopen = () => {
        console.log('Connected');
        setSocket(ws);
        reconnectAttempts.current = 0;
      };

      ws.onclose = () => {
        console.log('Disconnected');
        setSocket(null);
        if (!reconnectInterval.current) {
          reconnect();
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
        ws.close();
      };

      return ws;
    };

    const reconnect = () => {
      if (reconnectAttempts.current < 5) { 
        reconnectInterval.current = setTimeout(() => {
          console.log('Reconnecting...');
          reconnectAttempts.current += 1;
          setSocket(connect());
          reconnectInterval.current = null;
        }, 3000);
      } else {
        console.log('Max reconnect attempts reached');
      }
    };

    const ws = connect();

    return () => {
      if (reconnectInterval.current) clearTimeout(reconnectInterval.current);
    };
  }, []);

  return socket;
};

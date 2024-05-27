import { useEffect,useState } from "react";
export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const ws=new WebSocket('ws://localhost:8080');
    ws.onopen = () => {
      console.log('Connected');
      setSocket(ws);
    };
    ws.onclose=()=>{
      console.log('Disconnected');
      setSocket(null);
    }
    return () => {
      ws.close();
    };
  }, []);
  return socket;
};  
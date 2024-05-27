import { useEffect,useState } from "react";
export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const token=localStorage.getItem('token');
    console.log(token);
    const ws = new WebSocket(`ws://localhost:8080?token=${token}`);
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
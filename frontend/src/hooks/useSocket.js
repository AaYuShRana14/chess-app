import { useEffect,useState } from "react";
export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    if(localStorage.getItem("chess-app-token")===null){
      window.location.href='/signin';
      return;
    }
    const token=localStorage.getItem('chess-app-token');
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
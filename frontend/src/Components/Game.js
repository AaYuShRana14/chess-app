import { useState, useRef, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { useSocket } from "../hooks/useSocket";
const Game = () => {
  const chessRef = useRef(new Chess());
  const chess = chessRef.current;
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [position, setPosition] = useState(chess.fen());
  const [optionSquares, setOptionSquares] = useState({});
  const [playerColor, setPlayerColor] = useState('white'); 
  const [gameStarted, setGameStarted] = useState(false);
  
  if(localStorage.getItem('token')===null){
    window.location.href='/signin';
  }
  const[opponent,setOpponent] = useState(null);
  const socket = useSocket();
  useEffect(() => {
    if(localStorage.getItem('token')===null){
      window.location.href='/login';
    }
    if (!socket) return;
    socket.onmessage = (message) => {
      const data = JSON.parse(message.data);
      console.log(data);
      if (data.type === 'start') {
        setOpponent(data.opponent);
        chess.reset();
        setPlayerColor(data.color);
        setPosition(chess.fen());
      }
      if (data.type === 'move') {
        chess.move(data.move);
        setPosition(chess.fen());
      }
      if (data.type === 'gameover') {
        console.log('Game Over');
      }
      if(data.type === 'Reconnect') {
        setOpponent(data.opponent);
        setPlayerColor(data.color);
        setGameStarted(true);
        data.moves.forEach(move => {
          chess.move(move);
        });
        setPosition(chess.fen());
      }
    }
  }, [socket, chess]);

  const startGame = () => {
    setGameStarted(true);
    console.log('start');
    socket.send(JSON.stringify({ type: 'create' }));
  }

  const checkDrop = (from, to,promotion) => {
    console.log(from, to, promotion);
    if(!promotion) promotion = 'wQ';
    promotion = promotion.substring(1).toLowerCase();
    let move = { from, to, promotion};
    try{
      const result = chess.move(move);
      if(result.color !== playerColor.charAt(0)){
        chess.undo();
        throw new Error('Invalid Move');
      }
      
      setPosition(chess.fen());
      socket.send(JSON.stringify({ type: 'move', move: result.san }));
    }
    catch(e){
      return;
    } 
    setOptionSquares({});
  };

  const highlightSquares = (square) => {
    const moves = chess.moves({ square, verbose: true });
    const newSquares = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          chess.get(move.to) &&
          chess.get(move.to).color !== chess.get(square).color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
      return move;
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    };
    setOptionSquares(newSquares);
  };

  const squareClick = (square) => {
    if (selectedSquare) {
      checkDrop(selectedSquare, square);
      setSelectedSquare(null);
      return;
    }
    setSelectedSquare(square);
    highlightSquares(square);
  };

  return (
    <div>
    {opponent!==null && <h2>Opponent: {opponent.name} rating:{opponent.rating}</h2>}
      <header>
        <h1>React Chessboard</h1>
        <div className="board" style={{"width":"30%"}}>
          <Chessboard
            id="BasicBoard"
            position={position}
            onPieceDrop={checkDrop}
            showBoardNotation={true}
            animationDuration={0}
            onSquareClick={squareClick}
            customSquareStyles={optionSquares}
            boardOrientation={playerColor} 
            onPieceDragBegin={(piece, square) => highlightSquares(square)}
          />
        </div>
      </header>
      <button onClick={startGame} disabled={gameStarted}>Play</button>
    </div>
  );
};

export default Game;

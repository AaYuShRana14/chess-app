import "./App.css";
import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

const chess = new Chess();
function App() {
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [position, setPosition] = useState(chess.fen());

  const checkDrop = (from, to, promotion) => {
    try {
      if (promotion) {
        promotion = promotion.substring(1).toLowerCase();
      }
      console.log(chess.move({ from, to, promotion }));
      setPosition(chess.fen());
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const squareClick = (square) => {
    if(selectedSquare) {
      checkDrop(selectedSquare, square, 'q');
      setSelectedSquare(null);
      return;
    }
    setSelectedSquare(square);
    const highlightSquares = chess.moves({ square, verbose: true}).map((move) => move.to);
    console.log(highlightSquares);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Chessboard</h1>
        <div className="board">
          <Chessboard
            id="BasicBoard"
            position={position}
            onPieceDrop={checkDrop}
            showBoardNotation={true}
            animationDuration={0}
            onSquareClick={squareClick}
          />
        </div>
      </header>
    </div>
  );
}

export default App;

import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
const Game = () => {
  const chess = new Chess();
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [position, setPosition] = useState(chess.fen());
  const [optionSquares, setOptionSquares] = useState({});

  const checkDrop = (from, to, promotion) => {
    try {
      if (promotion) {
        promotion = promotion.substring(1).toLowerCase();
      }
      console.log(chess.move({ from, to, promotion }));
      chess.move({ from, to, promotion });
      setPosition(chess.fen());
    } catch (error) {
      console.log(error);
      return null;
    } finally {
      setOptionSquares({});
    }
  };

  const highlightSquares = (square) => {
    const moves = chess.moves({ square, verbose: true});
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
    if(selectedSquare) {
      checkDrop(selectedSquare, square, 'q');
      setSelectedSquare(null);
      return;
    }
    setSelectedSquare(square);
    const highlightSquares = chess.moves({ square, verbose: true}).map((move) => move.to);
    console.log(highlightSquares);
    highlightSquares(square);
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
            customSquareStyles={optionSquares}
            onPieceDragBegin={(piece, square) => highlightSquares(square)}
          />
        </div>
      </header>
    </div>
  );
};
export default Game;  
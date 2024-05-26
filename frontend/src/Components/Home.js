import React, { useState, useRef, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

const Home = () => {
  const chessRef = useRef(new Chess());
  const [position, setPosition] = useState(chessRef.current.fen());
  const [moves] = useState([
    "e4", "e5", "Nf3", "Nc6", "Bb5", "a6", "Ba4", "Nf6", "O-O", "Be7",
    "d3", "d6", "c3", "Bg4", "Nbd2", "O-O", "Re1", "Qd7", "Nf1", "Rae8",
    "Ng3", "Bd8", "h3", "Be6", "Be3", "Ne7", "d4", "exd4", "cxd4", "Ng6",
    "Bd2", "Nf4", "Bxf4"
  ]);
  const [moveIndex, setMoveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (moveIndex < moves.length) {
        const move = moves[moveIndex];
        const result = chessRef.current.move(move);
        if (result) {
          setPosition(chessRef.current.fen());
          setMoveIndex(moveIndex + 1);
        } else {
          console.error(`Invalid move: ${move}`);
          clearInterval(interval);
        }
      } else {
        clearInterval(interval);
        revertAllMoves();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [moveIndex, moves]);

  const revertAllMoves = () => {
    while (chessRef.current.undo()) {}
    setPosition(chessRef.current.fen());
    setMoveIndex(0);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Chessboard</h1>
        <div className="board">
          <Chessboard
            id="BasicBoard"
            position={position}
            onPieceDrop={() => {}}
            showBoardNotation={true}
            animationDuration={300}
          />
        </div>
      </header>
    </div>
  );
};

export default Home;

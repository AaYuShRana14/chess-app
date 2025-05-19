import { Chessboard } from "react-chessboard";
import "./Board.css";
import { Chess } from "chess.js";
import Player from "./Player.js";
import { useEffect, useState } from "react";

export const Board = (props) => {
  const chess = props.chess;
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(
    chess.history().length
  );
  const [displayedPosition, setDisplayedPosition] = useState(chess.fen());
  chess.fenFromHistory = function (index) {
    const moves = this.history().slice(0, index);
    const tempChess = new Chess();
    moves.forEach((move) => tempChess.move(move));
    return tempChess.fen();
  };

  useEffect(() => {
    setCurrentHistoryIndex(chess.history().length);
    setDisplayedPosition(chess.fen());
  }, [chess.history().length, chess]);
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        moveToPreviousPosition();
      } else if (event.key === "ArrowRight") {
        moveToNextPosition();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentHistoryIndex, chess]);

  const moveToPreviousPosition = () => {
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1;
      setCurrentHistoryIndex(newIndex);
      setDisplayedPosition(chess.fenFromHistory(newIndex));
    }
  };

  const moveToNextPosition = () => {
    if (currentHistoryIndex < chess.history().length) {
      const newIndex = currentHistoryIndex + 1;
      setCurrentHistoryIndex(newIndex);
      setDisplayedPosition(chess.fenFromHistory(newIndex));
    }
  };
  return (
    <div className="totalboard">
      <Player player={props.opponent} ref={props.playerRef1} />
      <div className="board">
        <Chessboard
          id="BasicBoard"
          position={displayedPosition}
          onPieceDrop={props.checkDrop}
          showBoardNotation={true}
          animationDuration={300}
          onSquareClick={props.squareClick}
          customSquareStyles={props.optionSquares}
          boardOrientation={props.playerColor}
          onPieceDragBegin={(piece, square) => props.highlightSquares(square)}
        />
      </div>
      <div className="controls">
        <button onClick={moveToPreviousPosition}>{"<"}</button>
        <button onClick={moveToNextPosition}>{">"}</button>
      </div>
      <Player player={props.me} ref={props.playerRef2} />
    </div>
  );
};

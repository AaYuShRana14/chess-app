import { Chessboard } from "react-chessboard";
import "./Board.css";
import Player from "./Player.js";

export const Board = (props) => {
  return (
    <div className="totalboard">
      <Player player={props.opponent} ref={props.playerRef1} />
      <div className="board">
        <Chessboard
          id="BasicBoard"
          position={props.position}
          onPieceDrop={props.checkDrop}
          showBoardNotation={true}
          animationDuration={0}
          onSquareClick={props.squareClick}
          customSquareStyles={props.optionSquares}
          boardOrientation={props.playerColor}
          onPieceDragBegin={(piece, square) => props.highlightSquares(square)}
        />
      </div>
      <Player player={props.me} ref={props.playerRef2} />
    </div>
  );
};

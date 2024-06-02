import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import "./Board.css";
export const Board = (props) => {
  
  return (
    <>
    <div className="opponent">
        <div>
        <img src={props.opponent.img} alt="Opponent" />
        <p>{props.opponent.name} &nbsp; {props.opponent.rating}</p>
        </div>
        <div>
            
        </div>
    </div>
      <div className="board">
        <Chessboard id="BasicBoard" position={props.fen} />
      </div>
    </>
  );
};

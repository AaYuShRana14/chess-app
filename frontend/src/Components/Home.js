import React, { useState, useRef, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { ContainerScroll } from "./ui/container-scroll-animation";
import { Boxes } from "./ui/background-boxes";
import { cn } from "../utils/cn.js";

const Board = () => {
  const chessRef = useRef(new Chess());
  const [position, setPosition] = useState(chessRef.current.fen());
  const [moves] = useState([
    "d4",
    "d5",
    "c4",
    "c6",
    "Nf3",
    "Nf6",
    "Nc3",
    "e6",
    "e3",
    "Nbd7",
    "Bd3",
    "dxc4",
    "Bxc4",
    "b5",
    "Bd3",
    "Bd6",
    "O-O",
    "O-O",
    "Qc2",
    "Bb7",
    "a3",
    "Rc8",
    "Ng5",
    "c5",
    "Nxh7",
    "Ng4",
    "f4",
    "cxd4",
    "exd4",
    "Bc5",
    "Be2",
    "Nde5",
    "Bxg4",
    "Bxd4+",
    "Kh1",
    "Nxg4",
    "Nxf8",
    "f5",
    "Ng6",
    "Qf6",
    "h3",
    "Qxg6",
    "Qe2",
    "Qh5",
    "Qd3",
    "Be3",
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
    <div>
      <Chessboard
        id="BasicBoard"
        position={position}
        onPieceDrop={() => {}}
        showBoardNotation={true}
        animationDuration={300}
      />
    </div>
  );
};

const Home = () => {
  return (
    <>
      <div className="relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center ">
        <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
        <Boxes />
        <div className="(flex flex-col overflow-hidden">
          <ContainerScroll
            titleComponent={
              <>
                <h1 className="text-4xl font-semibold text-white">
                  Unleash the power of <br />
                  <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                    Chess Gameplay
                  </span>
                </h1>
              </>
            }
          >
            <Board />
          </ContainerScroll>
        </div>
      </div>
    </>
  );
};

export default Home;

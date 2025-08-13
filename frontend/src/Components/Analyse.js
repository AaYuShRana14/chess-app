import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { useStockfish } from "../hooks/useStockfish";
import axios from "axios";
import Navbar from "./ui/Navbar";
import './Analyse.css';
const EvaluationBar = ({ stockfish }) => {
    const [cp, setCp] = useState(0);
    const maxCp = 1000;

    // White advantage grows from bottom, black from top
    const whitePercentage = Math.min(100, Math.max(0, 50 + (cp / maxCp) * 50));

    useEffect(() => {
        if (!stockfish) return;

        const handleMessage = (event) => {
            const message = event.data;
            if (message.includes("score")) {
                const match = message.match(/score cp (-?\d+)/);
                if (match) {
                    setCp(parseInt(match[1], 10));
                }
            }
        };

        stockfish.onmessage = handleMessage;
        return () => {
            stockfish.onmessage = null;
        };
    }, [stockfish]);

    return (
        <div style={{ marginRight: '3rem', alignItems: 'center' }}>
            <div
                style={{
                    position: 'absolute',
                    width: '30px',
                    height: '400px',
                    border: '1px solid white',
                    backgroundColor: 'black', // default black fill
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0, // white grows from bottom
                        width: '100%',
                        backgroundColor: 'white',
                        height: `${whitePercentage}%`,
                    }}
                />
            </div>
        </div>
    );
};

const Analyse = () => {
    const { matchid } = useParams();
    const [matchId, setMatchId] = useState(null);
    const stockfish = useStockfish();
    const [match, setMatch] = useState(null);

    useEffect(() => {
        if (matchid) {
            setMatchId(matchid);
        }
    }, [matchid]);

    useEffect(() => {
        if (matchId) {
            axios.get(`https://chess-app-opin.onrender.com/match/${matchId}`)
                .then((response) => {
                    if (response.data) {
                        setMatch(response.data);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching match:", error);
                });
        }
    }, [matchId]);

    const Board = () => {
        const chessRef = useRef(new Chess());
        const [position, setPosition] = useState(chessRef.current.fen());
        const [moveIndex, setMoveIndex] = useState(0);

        const moves = match?.moves || [];

        useEffect(() => {
            if (match) {
                chessRef.current.reset();
                setPosition(chessRef.current.fen());
                stockfish.postMessage(chessRef.current.fen());
                stockfish.postMessage('go depth 20');
                setMoveIndex(0);
            }
        }, [match, stockfish]);

        const handleForward = useCallback(() => {
            if (moveIndex < moves.length) {
                const nextMove = moves[moveIndex];
                const result = chessRef.current.move(nextMove);
                if (!result) {
                    console.error("Invalid move:", nextMove);
                    return;
                }

                setPosition(chessRef.current.fen());
                stockfish.postMessage(`position fen ${chessRef.current.fen()}`);
                stockfish.postMessage('go depth 20');
                setMoveIndex(moveIndex + 1);
            }
        }, [moveIndex, moves, stockfish]);

        const handleBackward = useCallback(() => {
            if (moveIndex > 0) {
                chessRef.current.undo();
                setPosition(chessRef.current.fen());
                stockfish.postMessage(`position fen ${chessRef.current.fen()}`);
                stockfish.postMessage('go depth 20');
                setMoveIndex(moveIndex - 1);
            }
        }, [moveIndex, stockfish]);

        const handleReset = () => {
            chessRef.current.reset();
            setPosition(chessRef.current.fen());
            setMoveIndex(0);
            stockfish.postMessage(chessRef.current.fen());
            stockfish.postMessage('go depth 20');
        };

        useEffect(() => {
            const handleKeydown = (e) => {
                if (e.key === "ArrowRight") {
                    handleForward();
                }
                if (e.key === "ArrowLeft") {
                    handleBackward();
                }
            };
            window.addEventListener("keydown", handleKeydown);
            return () => {
                window.removeEventListener("keydown", handleKeydown);
            };
        }, [handleForward, handleBackward]);

        if (!match) return <div>Loading...</div>;

        return (
            <div className="flex">
                <div className="flex flex-col gap-4">
                    {/* Black player info at the top */}
                    <div className="player-info">
                        {match?.black?.avatar ? (
                            <img
                                src={match.black.avatar}
                                alt={match.black.name}
                                className="avatar"
                            />
                        ) : null}
                        <span>{match?.black?.name || "Black Player"}</span>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex">
                            {stockfish !== undefined && <EvaluationBar stockfish={stockfish} />}
                            <Chessboard
                                id="AnalysisBoard"
                                position={position}
                                arePiecesDraggable={false}
                                showBoardNotation={true}
                                animationDuration={300}
                                customBoardStyle={{
                                    width: "400px",
                                    height: "400px",
                                    borderRadius: "10px",
                                    boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
                                }}
                            />
                        </div>

                        {/* White player info below the board */}
                        <div className="player-info">
                            {match.white.avatar ? (
                                <img
                                    src={match.white.avatar}
                                    alt={match.white.name}
                                    className="avatar"
                                />
                            ) : null}
                            <span>{match.white.name || "White Player"}</span>
                        </div>

                        <div className="controls ">
                            <button
                                onClick={handleBackward}
                                className="control-button"
                            >
                                {"<"}
                            </button>
                            <button
                                onClick={handleReset}
                                className="control-button reset"
                            >
                                Reset
                            </button>
                            <button
                                onClick={handleForward}
                                className="control-button"
                            >
                                {">"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <Navbar />
            <div className="text-white my-20">
                <h1 className="text-2xl sm:text-4xl mb-10 font-semibold align-middle text-center">
                    Chess Match Analysis
                </h1>
                <div className="flex justify-center">
                    <Board />
                </div>
            </div>
        </>
    );
};

export default Analyse;

import { useState, useEffect, useRef } from "react";
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
    const percentage = Math.min(100, Math.max(0, 50 + (cp / maxCp) * 50));
    useEffect(() => {
        if (!stockfish) return;

        const handleMessage = (event) => {
            const message = event.data;
            if (message.includes("score")) {
                const match = message.match(/score cp (-?\d+)/);
                if (match) {
                    const cp = parseInt(match[1], 10);
                    setCp(cp);
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
            <div style={{ position: 'absolute', width: '30px', height: '400px', border: '1px solid white' }}>
                <div
                    id="evaluation-bar"
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        backgroundColor: 'white',
                        height: `${percentage}%`,
                    }}>
                </div>
            </div>
        </div>
    );
};
const Analyse = () => {
    const { matchid } = useParams();
    const [matchId, setMatchId] = useState(null);
    const stockfish = useStockfish();
    useEffect(() => {
        if (matchid) {
            setMatchId(matchid);
        }
    }, [matchid]);
    const [match, setMatch] = useState(null);

    useEffect(() => {
        if (matchId) {
            axios.get(`http://localhost:8000/match/${matchId}`)
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
                stockfish.postMessage('go depth 2');
                setMoveIndex(0);
            }
        }, [match]);

        const handleForward = () => {
            if (moveIndex < moves.length) {
                chessRef.current.move(moves[moveIndex]);
                setPosition(chessRef.current.fen());
                stockfish.postMessage(`position fen ${chessRef.current.fen()}`);
                stockfish.postMessage('go depth 2');
                setMoveIndex(moveIndex + 1);
            }
        };

        const handleBackward = () => {
            if (moveIndex > 0) {
                chessRef.current.undo();
                setPosition(chessRef.current.fen());
                stockfish.postMessage(`position fen ${chessRef.current.fen()}`);
                stockfish.postMessage('go depth 2');
                setMoveIndex(moveIndex - 1);
            }
        };

        const handleReset = () => {
            chessRef.current.reset();
            setPosition(chessRef.current.fen());
            setMoveIndex(0);
            stockfish.postMessage(chessRef.current.fen());
            stockfish.postMessage('go depth 2');
        };

        if (!match) return <div>Loading...</div>;

        return (<div className="flex">
            
            <div className="">
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
                <div className="flex flex-col gap-4">
                    <div className="flex">
                {stockfish !== undefined && <EvaluationBar stockfish={stockfish}></EvaluationBar>}
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
                       
                    /> </div>

                    <div className="player-info ">
                        {match?.black?.avatar ? (
                            <img
                                src={match.black.avatar}
                                alt={match.black.name}
                                className="avatar"
                            />
                        ) : null}
                        <span>{match?.black?.name || "Black Player"}</span>
                    </div>

                    <div className="controls ">
                        <button
                            onClick={handleBackward}
                            className="control-button"
                        >
                            Backward
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
                            Forward
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
                <h1 className="text-2xl sm:text-4xl mb-10 font-semibold align-middle text-center">Chess Match Analysis</h1>
                <div className="flex justify-center">
                    <Board />
                </div>
            </div>
        </>
    );
};

export default Analyse;


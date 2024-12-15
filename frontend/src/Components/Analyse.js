import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import axios from "axios";
import Navbar from "./ui/Navbar";
import './Analyse.css';
const Analyse = () => {
    const { matchid } = useParams();
    const [matchId, setMatchId] = useState(null);
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
                setMoveIndex(0); 
            }
        }, [match]);
    
        const handleForward = () => {
            if (moveIndex < moves.length) {
                chessRef.current.move(moves[moveIndex]);
                setPosition(chessRef.current.fen());
                setMoveIndex(moveIndex + 1);
            }
        };
    
        const handleBackward = () => {
            if (moveIndex > 0) {
                chessRef.current.undo();
                setPosition(chessRef.current.fen());
                setMoveIndex(moveIndex - 1);
            }
        };
    
        const handleReset = () => {
            chessRef.current.reset();
            setPosition(chessRef.current.fen());
            setMoveIndex(0);
        };
    
        if (!match) return <div>Loading...</div>; 
    
        return (
            <div className="board-wrapper">
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
    
                <div className="board-container">
                    <Chessboard
                        id="AnalysisBoard"
                        position={position}
                        arePiecesDraggable={false}
                        showBoardNotation={true}
                        animationDuration={300}
                        customBoardStyle={{
                            borderRadius: "10px",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
                        }}
                    />
                </div>
    
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
    
                <div className="controls">
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
        );
    };

    return (
        <>
        <Navbar />
        <div className="container div relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center ">
            <h1 className="page-title">Chess Match Analysis</h1>
            <Board />
        </div>
        </>
    );
};

export default Analyse;


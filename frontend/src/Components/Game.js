import { Board } from "./ui/Board.js";
import { SideBar } from "./ui/SideBar.js";
import "./Game2.css";
import axios from "axios";
import Confetti from "react-confetti";
import { useState, useEffect, useRef } from "react";
import { GameHandler } from "../hooks/GameHandler.js";

const Game = () => {
  const { innerWidth: width, innerHeight: height } = window;
  const playerRef1 = useRef(null);
  const playerRef2 = useRef(null);
  const [confetti, setConfetti] = useState(false);
  const [me, setMe] = useState({
    name: "Me",
    id: "1",
    rating: 1500,
    img: "https://images.unsplash.com/photo-1511185307590-3c29c11275ca?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=1080&ixid=MnwxfDB8MXxyYW5kb218MHx8d2FsbHBhcGVyLGxhbmRzY2FwZXx8fHx8fDE3MTczNDA3NjQ&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1",
  });
  const {
    moves,
    gameover,
    selectedSquare,
    setSelectedSquare,
    position,
    setPosition,
    optionSquares,
    setOptionSquares,
    playerColor,
    setPlayerColor,
    gameStarted,
    setGameStarted,
    chats,
    setChats,
    opponent,
    setOpponent,
    chatHandler,
    startGame,
    checkDrop,
    highlightSquares,
    squareClick,
    startTimer,
    setStartTimer,
    onlineCount,
  } = GameHandler();

  const chatSend = (message) => {
    chatHandler(message);
  };

  useEffect(() => {
    if (gameover) {
      setStartTimer(false);
      if (gameover === playerColor) {
        setConfetti(true);
        setTimeout(() => {
          setConfetti(false);
        }, 5000);
      }
    }
  }, [gameover]);

  const playHandler = (t) => {
    startGame();
    playerRef1.current.setTime(t);
    playerRef2.current.setTime(t);
  };

  useEffect(() => {
    if (moves && startTimer) {
      playerRef1.current.toggle();
      playerRef2.current.toggle();
    }
  }, [moves]);

  useEffect(() => {
    if (startTimer) {
      if (playerColor === "white") {
        playerRef2.current.start();
        playerRef1.current.stop();
      } else {
        playerRef2.current.stop();
        playerRef1.current.start();
      }
    } else {
      playerRef1.current.stop();
      playerRef2.current.stop();
    }
  }, [startTimer]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/profile/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("chess-app-token")}`,
        },
      })
      .then((res) => {
        const data = res.data;
        if (data) {
          setMe({
            name: data.name,
            id: data._id,
            rating: data.rating,
            img: data.avatar,
          });
        }
      });
  }, []);

  return (
    <div className="main p-16 mt-12">
      {confetti && <Confetti width={width} height={height}/>}
      <div className="sub-main">
        <Board
          me={me}
          opponent={opponent}
          playerRef1={playerRef1}
          playerRef2={playerRef2}
          playerColor={playerColor}
          position={position}
          optionSquares={optionSquares}
          checkDrop={checkDrop}
          highlightSquares={highlightSquares}
          squareClick={squareClick}
        />
        <SideBar
          isStarted={startTimer}
          isPlaying={playHandler}
          gameover={gameover}
          moves={moves}
          chats={chats}
          me={me}
          chatSend={chatSend}
        />
        <div>{onlineCount}</div>
      </div>
    </div>
  );
};

export default Game;

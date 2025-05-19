import { useState, useRef, useEffect } from "react";
import { Chess } from "chess.js";
import { useSocket } from "./useSocket";
import axios from "axios";

export const GameHandler = () => {
  const chessRef = useRef(new Chess());
  const chess = chessRef.current;
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [moves, setMoves] = useState([]);
  const [position, setPosition] = useState(chess.fen());
  const [optionSquares, setOptionSquares] = useState({});
  const [playerColor, setPlayerColor] = useState("white");
  const [gameStarted, setGameStarted] = useState(false);
  const [chats, setChats] = useState([]);
  const [startTimer, setStartTimer] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [gameover, setGameover] = useState(false);
  const [opponent, setOpponent] = useState({
    name: "Opponent",
    rating: 1500,
    img: "https://images.unsplash.com/photo-1511185307590-3c29c11275ca?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=1080&ixid=MnwxfDB8MXxyYW5kb218MHx8d2FsbHBhcGVyLGxhbmRzY2FwZXx8fHx8fDE3MTczNDA3NjQ&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1",
  });

  if (localStorage.getItem("chess-app-token") === null) {
    window.location.href = "/signin";
  }

  let socket = useSocket();

  useEffect(() => {
    if (localStorage.getItem("chess-app-token") === null) {
      window.location.href = "/signin";
    }
    if (!socket) return;

    socket.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.type === "onlineCount") {
        setOnlineCount(data.count);
      }
      if (data.type === "start") {
        setChats([]);
        axios
          .get(
            `https://chess-app-opin.onrender.com/profile/${data.opponent.id}`
          )
          .then((res) => {
            setOpponent({
              name: res.data.name,
              rating: res.data.rating,
              img: res.data.avatar,
            });
          });
        chess.reset();
        setPlayerColor(data.color);
        setStartTimer(true);
        setPosition(chess.fen());
      }
      if (data.type === "move") {
        chess.move(data.move);
        setPosition(chess.fen());
        setMoves(chess.history());
      }
      if (data.type === "gameover") {
        setGameover(data.winner);
      }
      if (data.type === "Reconnect") {
        axios
          .get(`https://chess-app-opin.onrender.com/profile/${data.opponent.id}`)
          .then((res) => {
            setOpponent({
              name: res.data.name,
              rating: res.data.rating,
              img: res.data.avatar,
            });
          });
        setPlayerColor(data.color);
        setGameStarted(true);
        setStartTimer(true);
        data.moves.forEach((move) => {
          chess.move(move);
        });
        setPosition(chess.fen());
        setMoves(chess.history());
      }
      if (data.type === "chat") {
        setChats((prevChats) => [
          ...prevChats,
          { message: data.message, sender: "Opponent" },
        ]);
        setChats((prevChats) => [
          ...prevChats,
          { message: data.message, sender: "Opponent" },
        ]);
      }
    };
  }, [socket, chess]);

  const chatHandler = (message) => {
    if (socket) {
      socket.send(JSON.stringify({ type: "chat", message }));
    } else {
      setTimeout(() => {
        socket.send(JSON.stringify({ type: "chat", message }));
      }, 500);
    }
    setChats((prevChats) => [...prevChats, { message, sender: "Me" }]);
  };

  const startGame = () => {
    setGameStarted(true);
    console.log("start");
    chess.reset();
    setMoves([]);
    setPosition(chess.fen());
    setGameover(false);
    setStartTimer(false);
    if (socket) {
      socket.send(JSON.stringify({ type: "create" }));
    } else {
      console.log("trying to reconnect");
      setTimeout(() => {
        socket.send(JSON.stringify({ type: "create" }));
      }, 500);
    }
  };

  const checkDrop = (from, to, promotion) => {
    if (!promotion) promotion = "wQ";
    promotion = promotion.substring(1).toLowerCase();
    let move = { from, to, promotion };
    try {
      const result = chess.move(move);
      if (result.color !== playerColor.charAt(0)) {
        chess.undo();
        throw new Error("Invalid Move");
      }

      setPosition(chess.fen());
      if (socket) {
        socket.send(JSON.stringify({ type: "move", move: result.san }));
      } else {
        setTimeout(() => {
          socket.send(JSON.stringify({ type: "move", move: result.san }));
        }, 500);
      }
    } catch (e) {
      setOptionSquares({});
      return false;
    }
    setMoves(chess.history());
    setOptionSquares({});
    return true;
  };

  const highlightSquares = (square) => {
    const moves = chess.moves({ square, verbose: true });
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
    if (selectedSquare) {
      if (!checkDrop(selectedSquare, square)) {
        setSelectedSquare(square);
        highlightSquares(square);
      } else {
        setSelectedSquare(null);
      }
      return;
    }
    setSelectedSquare(square);
    highlightSquares(square);
  };
  return {
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
    onlineCount,
    opponent,
    setOpponent,
    chatHandler,
    startGame,
    checkDrop,
    highlightSquares,
    squareClick,
    startTimer,
    setStartTimer,
    gameover,
    moves,
    chess,
  };
};



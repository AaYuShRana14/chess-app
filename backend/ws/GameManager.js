const Game = require("./Game.js");
const updateStatus = require("./updateStatus.js");

class GameManager {
  #games;
  #pendingUser;
  #users;

  constructor() {
    this.#users = [];
    this.#games = [];
  }

  addUser(player) {
    const game = this.#games.find(
      (game) => game.p1.email === player.email || game.p2.email === player.email
    );
    if (game) {
      if (game.p1.email === player.email) {
        game.player1.close();
        game.p1 = player;
        game.player1 = player.socket;
        player.socket.send(
          JSON.stringify({
            type: "Reconnect",
            color: "white",
            opponent: {
              mail: game.p2.email,
              id: game.p2.id
            },
            moves: game.board.history(),
          })
        );
        game.player2.send(JSON.stringify({ type: "OpponentReconnected" }));
      } else {
        game.player2.close();
        game.p2 = player;
        game.player2 = player.socket;
        player.socket.send(
          JSON.stringify({
            type: "Reconnect",
            color: "black",
            opponent: {
              mail: game.p1.email,
              id: game.p1.id
            },
            moves: game.board.history(),
          })
        );
        game.player1.send(JSON.stringify({ type: "OpponentReconnected" }));
      }

      clearTimeout(game.moveTimeout);
      game.lastMoveTime = Date.now();
      const remainingTime = game.totalMoves % 2 === 0 ? game.player1Time : game.player2Time;
      game.moveTimeout = setTimeout((game) => {
        game.endGame();
      }, remainingTime, game);
    } else {
      this.#users.push(player);
    }
    this.addHandler(player);
  }

  removeUser(player) {
    const socket = player.socket;
    const game = this.#games.find(
      (game) => game.player1 === socket || game.player2 === socket
    );
    if (game) {
      if (game.player1 === socket) {
        game.player2.send(JSON.stringify({ type: "OpponentDisconnected" }));
      } else {
        game.player1.send(JSON.stringify({ type: "OpponentDisconnected" }));
      }
    }
    setTimeout(() => {
      const game = this.#games.find(
        (game) => game.player1 === socket || game.player2 === socket
      );
      if (game) {
        if (game.player1 === socket) {
          game.player2.send(JSON.stringify({ type: "gameover", winner: "black" }));
          game.player2.close();
          updateStatus(game.p1.id, game.p2.id, game.p2.id, "win", game.board.history(), process.env.PASS_KEY);
        } else {
          game.player1.send(JSON.stringify({ type: "gameover", winner: "white" }));
          game.player1.close();
          updateStatus(game.p1.id, game.p2.id, game.p1.id, "win", game.board.history(), process.env.PASS_KEY);
        }
        this.#games = this.#games.filter((g) => g !== game);
      }
    }, 20000);
  }

  addHandler(player) {
    const socket = player.socket;
    socket.on("message", (message) => {
      message = JSON.parse(message);
      if (message.type === "create") {
        if (this.#pendingUser && this.#pendingUser.email !== player.email) {
          const game = new Game(this.#pendingUser, player, this.removeGameInstance.bind(this));
          this.#games.push(game);
          console.log("Game Created");
          game.moveTimeout = setTimeout((game) => {
            game.endGame();
          }, game.player1Time, game);
          this.#pendingUser = null;
        } else {
          this.#pendingUser = player;
        }
      }
      if (message.type === "move") {
        const game = this.#games.find(
          (game) => game.player1 === socket || game.player2 === socket
        );
        if (game) {
          clearTimeout(game.moveTimeout);
          const elapsedTime = Date.now() - game.lastMoveTime;
          if (game.totalMoves % 2 === 0) {
            game.player1Time -= elapsedTime;
            if (game.player1Time <= 0) {
              game.player2.send(JSON.stringify({ type: 'gameover', winner: 'black' }));
              game.player1.send(JSON.stringify({ type: 'gameover', winner: 'black' }));
              updateStatus(game.p1.id, game.p2.id, game.p2.id, "win", game.board.history(), process.env.PASS_KEY);
              game.player2.close();
              game.player1.close();
              this.#games = this.#games.filter((g) => g !== game);
              return;
            }
          } else {
            game.player2Time -= elapsedTime;
            if (game.player2Time <= 0) {
              game.player2.send(JSON.stringify({ type: 'gameover', winner: 'white' }));
              game.player1.send(JSON.stringify({ type: 'gameover', winner: 'white' }));
              updateStatus(game.p1.id, game.p2.id, game.p1.id, "win", game.board.history(), process.env.PASS_KEY);
              game.player2.close();
              game.player1.close();
              this.#games = this.#games.filter((g) => g !== game);
              return;
            }
          }
          game.lastMoveTime = Date.now();
          const time = game.totalMoves % 2 === 0 ? game.player1Time : game.player2Time;
          game.makemove(socket, message.move);
          game.moveTimeout = setTimeout((game) => {
            game.endGame();
          }, time, game);
        }
      }
      const game = this.#games.find(
        (game) => game.player1 === socket || game.player2 === socket
      );
      if (game) {
        if (message.type === "chat") {
          if (game.player1 === socket) {
            game.player2.send(JSON.stringify({ type: "chat", message: message.message }));
          } else {
            game.player1.send(JSON.stringify({ type: "chat", message: message.message }));
          }
        }
      }
    });
  }

  removeGameInstance(gameInstance) {
    this.#games = this.#games.filter((game) => game !== gameInstance);
  }
}

module.exports = GameManager;

const Chess = require('chess.js').Chess;
const updateStatus = require("./updateStatus.js");
require('dotenv').config();

class Game {
    constructor(p1, p2, removeGameInstanceCallback) {
        this.p1 = p1;
        this.p2 = p2;
        this.player1 = p1.socket;
        this.player2 = p2.socket;
        this.board = new Chess();
        this.player1Time = 10 * 60 * 1000;
        this.player2Time = 10 * 60 * 1000;
        this.lastMoveTime = Date.now();
        this.totalMoves = 0;
        this.moveTimeout = null;
        this.gameOver = false;
        this.removeGameInstanceCallback = removeGameInstanceCallback;

        this.player1.send(JSON.stringify({ type: 'start', color: 'white', opponent: { mail: p2.email, id: p2.id } }));
        this.player2.send(JSON.stringify({ type: 'start', color: 'black', opponent: { mail: p1.email, id: p1.id } }));
    }

    makemove(player, move) {
        if (this.gameOver) {
            return;
        }

        if (this.totalMoves % 2 === 0 && player !== this.player1) {
            return;
        }
        if (this.totalMoves % 2 === 1 && player !== this.player2) {
            return;
        }
        try {
            this.board.move(move);
            this.totalMoves++;
        } catch (e) {
            return;
        }

        if (this.board.isGameOver()) {
            this.endGame();
            return;
        }

        const message = JSON.stringify({ type: 'move', move });
        if (this.totalMoves % 2 === 0) {
            this.player1.send(message);
        } else {
            this.player2.send(message);
        }
    }

    endGame() {
        if (this.gameOver) {
            return;
        }
        this.gameOver = true;
        clearTimeout(this.moveTimeout);

        let winner;
        if (this.board.isStalemate() || this.board.isThreefoldRepetition() || this.board.isDraw()) {
            winner = 'draw';
            this.player1.send(JSON.stringify({ type: 'gameover', winner }));
            this.player2.send(JSON.stringify({ type: 'gameover', winner }));
            updateStatus(this.p1.id, this.p2.id, this.p1.id, "draw", this.board.history(), process.env.PASS_KEY);
        } else {
            conosle.log("*******")
            console.log(this.p1);
            console.log(this.p2);
        
            winner = this.board.turn() === 'w' ? 'black' : 'white';
            this.player1.send(JSON.stringify({ type: 'gameover', winner }));
            this.player2.send(JSON.stringify({ type: 'gameover', winner }));
            const winnerid = winner === "white" ? this.p1.id : this.p2.id;
            updateStatus(this.p1.id, this.p2.id, winnerid, "win", this.board.history(), process.env.PASS_KEY);
        }

        if (typeof this.removeGameInstanceCallback === 'function') {
            this.removeGameInstanceCallback(this);
        }
    }
}

module.exports = Game;

const Chess = require('chess.js').Chess;
const axios = require('axios');
class Game {
    constructor(p1, p2) {
        this.p1=p1;
        this.p2=p2;
        this.player1 = p1.socket;
        this.player2 = p2.socket;
        this.board = new Chess();
        this.player1Time = 10 * 60 * 1000;
        this.player2Time = 10 * 60 * 1000;
        this.lastMoveTime = Date.now();
        this.totalMoves = 0;
        this.moveTimeout = null;
        this.player1.send(JSON.stringify({ type: 'start', color: 'white',opponent:{mail:p2.email,id:p2.id}}));
        this.player2.send(JSON.stringify({ type: 'start', color: 'black' ,opponent:{mail:p1.email,id:p1.id}}));
    }

    makemove(player, move) {
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
            const winner = this.board.turn() === 'w' ? 'black' : 'white';
            this.player1.send(JSON.stringify({ type: 'gameover', winner }));
            this.player2.send(JSON.stringify({ type: 'gameover', winner }));
            axios.put('http://localhost:8000/game/update').then((res) => {
                console.log(res.data);
            });
            return;
        }
        const message = JSON.stringify({ type: 'move', move });
        if (this.totalMoves % 2 === 0) {
            this.player1.send(message);
        } else {
            this.player2.send(message);
        }
    }
}

module.exports = Game;

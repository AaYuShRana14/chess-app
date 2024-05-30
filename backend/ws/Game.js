const Chess = require('chess.js').Chess;
class Game {
    constructor(p1, p2) {
        this.p1=p1;
        this.p2=p2;
        this.player1 = p1.socket;
        this.player2 = p2.socket;
        this.board = new Chess();
        this.moves = [];
        this.startTime = Date.now();
        this.totalMoves = 0;
        this.player1.send(JSON.stringify({ type: 'start', color: 'white',opponent:{mail:p2.email,name:p2.name,rating:p2.rating}}));
        this.player2.send(JSON.stringify({ type: 'start', color: 'black' ,opponent:{mail:p1.email,name:p1.name,rating:p1.rating}}));
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
            this.moves.push(move);
        } catch (e) {
            return;
        }
        if (this.board.isGameOver()) {
            const winner = this.board.turn() === 'w' ? 'black' : 'white';
            console.log(this.moves);
            this.player1.send(JSON.stringify({ type: 'gameover', winner }));
            this.player2.send(JSON.stringify({ type: 'gameover', winner }));
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

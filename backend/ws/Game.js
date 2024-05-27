const Chess = require('chess.js').Chess;
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.moves = [];
        this.startTime = Date.now();
        this.totalMoves = 0;
        this.player1.send(JSON.stringify({ type: 'start', color: 'white' }));
        this.player2.send(JSON.stringify({ type: 'start', color: 'black' }));
    }

    makemove(player, move) {
        // console.log(move);
        
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

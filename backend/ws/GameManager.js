const Game = require('./Game.js');
class GameManager {
    #games;
    #pendingUser;
    #users;
    constructor() {
        this.#users=[];
        this.#games = [];
    }
    addUser(socket){
        this.#users.push(socket);
        this.addHandler(socket);
    }
    removeUser(socket){
        this.#users = this.#users.filter(user=>user!==socket);
    }
    addHandler(socket){
        socket.on('message', message => {
            message = JSON.parse(message);
            if(message.type==='create'){
                if(this.#pendingUser){
                    const game = new Game(this.#pendingUser, socket);
                    this.#games.push(game);
                    console.log('Game Created');    
                    this.#pendingUser = null;
                }
                else{
                    this.#pendingUser = socket;
                }
            }
            if(message.type==='move'){
                const game = this.#games.find(game=>game.player1===socket||game.player2===socket);
                if(game){
                    game.makemove(socket,message.move);
                }
            }
        });
    }
}
module.exports = GameManager;
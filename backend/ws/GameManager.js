const Game = require('./Game.js');
class GameManager {
    #games;
    #pendingUser;
    #users;
    constructor() {
        this.#users=[];
        this.#games = [];
    }
    addUser(player){
        this.#users.push(player);
        this.addHandler(player);
    }
    removeUser(player){
        this.#users = this.#users.filter(user=>user.email!==player.email);
    }
    addHandler(player){
        const socket = player.socket;
        socket.on('message', message => {
            message = JSON.parse(message);
            if(message.type==='create'){
                if(this.#pendingUser){
                    console.log("hola amigos")
                    const game = new Game(this.#pendingUser.socket, socket);
                    console.log(game);
                    this.#games.push(game);
                    console.log('Game Created');    
                    this.#pendingUser = null;
                }
                else{
                    this.#pendingUser = player;
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
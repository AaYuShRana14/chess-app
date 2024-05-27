const WebSocketServer = require('ws').WebSocketServer;
const GameManager = require('./GameManager');
const wss = new WebSocketServer({ port: 8080 });
const gameManager=new GameManager();
wss.on('connection', ws => {

    gameManager.addUser(ws);
    ws.on('disconnect', () => {
        gameManager.removeUser(ws);
    });
});

const WebSocketServer = require('ws').WebSocketServer;
const GameManager = require('./GameManager');
const wss = new WebSocketServer({ port: 8080 });
const gameManager=new GameManager();
const Auth = require('./Auth');
const url = require('url');
wss.on('connection', (ws,req)=> {
    const queryParams = url.parse(req.url, true).query;
    const token = queryParams.token;
    if(!token){
        ws.close();
        return;
    }
    const user=Auth(token);
    const userEmail=user.email; 
    console.log(userEmail);
    gameManager.addUser(ws);
    ws.on('disconnect', () => {
        gameManager.removeUser(ws);
    });
});

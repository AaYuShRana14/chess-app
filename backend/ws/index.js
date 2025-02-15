const GameManager = require('./GameManager');
const Player = require('./Player');
const wss=require('./wss');
const gameManager = new GameManager();
const {sendOnlineCount} = require('./cron');
const Auth = require('./Auth');
const url = require('url');
require('dotenv').config();
wss.on('connection', async(ws, req) => {
    console.log('Connected');
    const queryParams = url.parse(req.url, true).query;
    const token = queryParams.token;
    if (!token) {
        ws.close();
        return;
    }
    const user= Auth(token);
    const userEmail = user.email;
    const id=user.id;
    const player = new Player(ws, userEmail,id);
    gameManager.addUser(player);
    ws.on('close', () => {
        console.log('Disconnected');
        gameManager.removeUser(player);
    });
});
sendOnlineCount();

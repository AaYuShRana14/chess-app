const WebSocketServer = require('ws').WebSocketServer;
const GameManager = require('./GameManager');
const Player = require('./Player');
const wss = new WebSocketServer({ port: 8080 });
const gameManager = new GameManager();
const Auth = require('./Auth');
const url = require('url');
const mongoose = require('mongoose');
require('dotenv').config();
const DATABASE_URL = process.env.DATABASE_URL;

mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => { console.log("Connected to database") }).catch((err) => { console.log(err) });

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
    const player = new Player(ws, userEmail);
    await player.init();
    gameManager.addUser(player);
    ws.on('close', () => {
        gameManager.removeUser(player);

    });
});

const WebSocketServer = require('ws').WebSocketServer;
const wss = new WebSocketServer({ port: 8080 });
module.exports=wss;
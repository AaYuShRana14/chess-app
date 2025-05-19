const wss=require('./wss');
const cron = require('node-cron');
function sendOnlineCount(){
    wss.clients.forEach(client => {
        if (client.readyState === client.OPEN) {
            client.send(JSON.stringify({type:'onlineCount',count:wss.clients.size}));
        }
    });
}
cron.schedule('*/5 * * * * *', sendOnlineCount);
module.exports={sendOnlineCount}; 
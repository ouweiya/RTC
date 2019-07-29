const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 7777 });
let users = {};

wss.on('connection', ws => {
  console.log('有人连接');
  ws.on('message', mes => {
    const d = JSON.parse(mes);
    switch (d.type) {
      case 'login':
        users[d.user] = ws;
        break;
      case 'offer':
        users.other.send(JSON.stringify(d));
        break;
      case 'answer':
        users.main.send(JSON.stringify(d));
        break;
      case 'candidate':
        users.other.send(JSON.stringify({ type: 'candidate', candidate: d.candidate }));
        break;
      case 'close':
        console.log(d.user);
        users[d.user].send(JSON.stringify({ type: 'close' }));
        break;
      default:
        break;
    }
  });
});

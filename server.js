const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');

const server = https.createServer({
  cert: fs.readFileSync('./https/cert.pem'),
  key: fs.readFileSync('./https/key.pem')
});

const wss = new WebSocket.Server({ server });

let users = {};

wss.on('connection', ws => {
  console.log('有人连接')
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

server.listen(8080);

// const WebSocket = require('ws');
// const wss = new WebSocket.Server({ port: 8080 });
// global.users = users;

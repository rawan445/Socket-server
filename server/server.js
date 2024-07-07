const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const users = [
  { id: 1, name: 'Rawan' },
  { id: 2, name: 'Leen' },
  { id: 3, name: 'Lamia' },
];

app.use(cors());

io.on('connection', (socket) => {
  console.log('a user connected');

  const currentUser = users[Math.floor(Math.random() * users.length)];
  socket.user = currentUser;

  socket.emit('user info', currentUser);

  socket.on('disconnect', () => {
    console.log(`${socket.user.name} disconnected`);
  });

  socket.on('chat message', (msg) => {
    console.log(`${socket.user.name} : ${msg.message}`);
    io.emit('chat message', { user: socket.user, message: msg.message });
  });

  socket.on('like message', (msg) => {
    console.log(`${socket.user.name} liked message from ${msg.user.name}`);
    const targetSocket = [...io.sockets.sockets.values()].find(s => s.user.id === msg.user.id);
// console.log(io.sockets.,": targetSocket");
    if (targetSocket) {
      targetSocket.emit('like message', { fromUser: socket.user, message: msg.message });
    }
  });
});

server.listen(4000, () => {
  console.log('Socket.io server is listening on *:4000');
});

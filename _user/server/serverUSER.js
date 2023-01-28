/*
This is the USER'S server. 
The server that we are trying to monitor for traffic.
*/
const path = require('path');
const app = require('express')();
//const http = require('http').Server(app);
const { createServer } = require('http');
const { Server } = require('socket.io');
const httpServer = createServer(app);

const { setup } = require('socketman');

const io = require('socket.io')(httpServer, {
  cors: {
    origin: '*', // this will be our hosted website :)
  },
});

const users = io.of('/users');
const bongo = io.of('/bongo');

setup(io, {
  namespaceName: '/nsp',
  auth: {
    username: 'admin',
    password: '$2b$10$heqvAkYMez.Va6Et2uXInOnkCT6/uQj1brkrbyG3LpopDklcq7ZOS', // "changeit" encrypted with bcrypt
  },
});

//
//
//
//
//
//
//
//
//
//

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/index.html'));
});

io.on('connection', (socket) => {
  socket.on('join', function (room) {
    socket.join(room);
    console.log(socket.rooms);
  });

  // consider this middleware. this will catch all events and then continue through other "specific" listeners
  socket.on('send message', (msg) => {
    io.emit('receive message', msg);
  });
  socket.on('test-event', (payload) => {});

  socket.on('change-color', (array, callback) => {
    const color = [];
    for (let i = 0; i < 3; i++) {
      color.push(Math.floor(Math.random() * 256));
    }
    const colorStr = `rgb(${color.join(', ')})`;

    callback(colorStr);
  });
  socket.on('event-3', () => {
    socket.emit('event-response', 'hello client');
  });
  // console.log(socket.handshake);
  // console.log(socket.rawListeners());
  // console.log(socket.eventNames());
});

bongo.on('connection', (socket) => {
  socket.on('join', function (room) {
    socket.join(room);
    console.log(socket.rooms);
  });
  // consider this middleware. this will catch all events and then continue through other "specific" listeners
  socket.on('send message', (msg) => {
    io.emit('receive message', msg);
  });
  socket.on('test-event', (payload) => {});

  socket.on('change-color', (array, callback) => {
    const color = [];
    for (let i = 0; i < 3; i++) {
      color.push(Math.floor(Math.random() * 256));
    }
    const colorStr = `rgb(${color.join(', ')})`;

    callback(colorStr);
  });
  socket.on('event-3', (roomName) => {
    console.log(roomName);
    socket.to(roomName).emit('receive message', 'it worked');
  });
  // console.log(socket.handshake);
  // console.log(socket.rawListeners());
  // console.log(socket.eventNames());
});

users.on('connection', (socket) => {
  // consider this middleware. this will catch all events and then continue through other "specific" listeners
  socket.on('send message', (msg) => {
    io.emit('receive message', msg);
  });
  socket.on('test-event', (payload) => {});

  socket.on('change-color', (array, callback) => {
    const color = [];
    for (let i = 0; i < 3; i++) {
      color.push(Math.floor(Math.random() * 256));
    }
    const colorStr = `rgb(${color.join(', ')})`;

    callback(colorStr);
  });
  socket.on('event-3', () => {
    socket.emit('event-response', 'hello client');
  });
  // console.log(socket.handshake);
  // console.log(socket.rawListeners());
  // console.log(socket.eventNames());
});

httpServer.listen(process.env.USERPORT || 3333, () => {
  console.log(`USER server running at 3333`);
});

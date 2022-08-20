/*

This is the USER'S server. 
The server that we are trying to monitor for traffic.

*/
const path = require('path');
const app = require('express')();
const http = require('http').Server(app);

// would be best if the dev didn't have to manually allow CORS from our domain
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
  },
});

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/index.html'));
});

const adminNamespace = io.of('/admin');
io.on('connection', (socket) => {
  // consider this middleware. this will catch all events and then continue through other "specific" listeners
  socket.onAny((...args) => {
    // this will listen to any event Not sent from GUI
    console.log('received event!');
    // "forwards" the info to our GUI
    adminNamespace.emit('event_received', socket.id, args, new Date());
  });

  socket.onAnyOutgoing((...args) => {
    console.log('sent event!');
    adminNamespace.emit('event_sent', socket.id, args, new Date());
  });

  socket.on('send message', (msg) => {
    console.log(msg);
    io.emit('receive message', msg);
  });
  socket.on('test-event', (payload) => {
    console.log('test received', payload);
  });
  socket.on('change-color', (array, callback) => {
    console.log(array);

    let color = [];
    for (let i = 0; i < 3; i++) {
      color.push(Math.floor(Math.random() * 256));
    }
    color = `rgb(${color.join(', ')})`;
    console.log('setting color from server');
    callback(color);
  });
  socket.on('event-3', () => {
    console.log('received event 3');
    socket.emit('event-response', 'hello client');
  });
  // console.log(socket.handshake);
  // console.log(socket.rawListeners());
  // console.log(socket.eventNames());
});

http.listen(process.env.USERPORT || 3333, () => {
  console.log(`USER server running at 3333`);
});

/*
This is the USER'S server. 
The server that we are trying to monitor for traffic.
*/
const path = require('path');
const { allowedNodeEnvironmentFlags } = require('process');
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

//function that takes event array and turns into object for frontend
//some type of check for callback
const createEventObj = (socketID, event) => {
  //instance of
  obj.cb = event[event.length - 1] instanceof Function;
  const obj = {};
  obj.socketId = socketID;
  obj.eventName = event[0];
  obj.payload = event[1];
  // obj.cb = event[2];
  obj.date = new Date();
  //add room and namespace to this obj

  return obj;
};

// listen to all events sent from admin
adminNamespace.on('connection', (socket) => {
  socket.onAny((...args) => {
    console.log('received from admin==>', args);
    // invoke a callback if passed
    if (typeof args[args.length - 1] === 'function')
      args[args.length - 1]('arg1', 'arg2');
  });
});

io.on('connection', (socket) => {
  // consider this middleware. this will catch all events and then continue through other "specific" listeners
  socket.onAny((...args) => {
    // this will listen to any event Not sent from GUI
    // "forwards" the info to our GUI
    //change data structure of args from arr into object
    const eventObj = createEventObj(socket.id, args);

    adminNamespace.emit('event_received', eventObj);
  });

  socket.onAnyOutgoing((...args) => {
    const eventObj = createEventObj(socket.id, args);
    adminNamespace.emit('event_sent', eventObj);
  });

  socket.on('send message', (msg) => {
    io.emit('receive message', msg);
  });
  socket.on('test-event', (payload) => {});

  socket.on('change-color', (array, callback) => {
    let color = [];
    for (let i = 0; i < 3; i++) {
      color.push(Math.floor(Math.random() * 256));
    }
    color = `rgb(${color.join(', ')})`;

    callback(color);
  });
  socket.on('event-3', () => {
    socket.emit('event-response', 'hello client');
  });
  // console.log(socket.handshake);
  // console.log(socket.rawListeners());
  // console.log(socket.eventNames());
});

http.listen(process.env.USERPORT || 3333, () => {
  console.log(`USER server running at 3333`);
});

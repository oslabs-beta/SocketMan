/*

This is OUR server. 
The server that serves our GUI webpage.

*/
const path = require('path');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
  },
});

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/index.html'));
});

http.listen(process.env.DEVPORT || 3000, () => {
  console.log(`GUI server running at 3000`);
});

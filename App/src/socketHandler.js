import { Server } from 'socket.io';

//function to instantiate new socket.io server with no cors restrictions
export default function socketHandler(server) {
	//const io = new Server(server);

	const io = new Server(server, {
		cors: {
			//origin: ['http://localhost:4173', 'http://localhost:5173']
			origin: '*'
		}
	});

	// Socket.IO stuff goes here
	io.on('connection', (socket) => {
		// Generate a random username and send it to the client to display it
		let username = `User ${Math.round(Math.random() * 999999)}`;
		socket.emit('name', username);

		// Receive incoming messages and broadcast them
		socket.on('message', (message) => {
			io.emit('message', {
				from: username,
				message: message,
				time: new Date().toLocaleString()
			});
		});
	});

	console.log('SocketIO injected');
}

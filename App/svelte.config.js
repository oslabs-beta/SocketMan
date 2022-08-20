import adapter from '@sveltejs/adapter-node';
//import adapter from '@sveltejs/adapter-auto';
//import socketHandler from './src/socketHandler.js'; // <- Import the new function

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter()
	}
};

export default config;

//
// import adapter from '@sveltejs/adapter-node';
// // import preprocess from 'svelte-preprocess';
// import { Server } from 'socket.io';

// /** @type {import('@sveltejs/kit').Config} */
// const config = {
// 	kit: {
// 		adapter: adapter(),
// 		vite: {
// 			plugins: [
// 				{
// 					name: 'sveltekit-socket-io',
// 					configureServer(server) {
// 						// eslint-disable-next-line no-unused-vars
// 						const io = new Server(server.httpServer);

// 						// Socket.IO stuff goes here
// 						io.on('connection', (socket) => {
// 							// Generate a random username and send it to the client to display it
// 							let username = `User ${Math.round(Math.random() * 999999)}`;
// 							socket.emit('name', username);

// 							// Receive incoming messages and broadcast them
// 							socket.on('message', (message) => {
// 								io.emit('message', {
// 									from: username,
// 									message: message,
// 									time: new Date().toLocaleString()
// 								});
// 							});
// 						});

// 						console.log('SocketIO injected');
// 					}
// 				}
// 			]
// 		}
// 	}
// };

// export default config;

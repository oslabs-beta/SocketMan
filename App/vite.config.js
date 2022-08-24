import { sveltekit } from '@sveltejs/kit/vite';
import socketHandler from './src/socketHandler.js'; // <- Import the new function
import adapter from '@sveltejs/adapter-node';

/** @type {import('vite').UserConfig} */
const config = {
	kit: {
		adapter: adapter()
	},

	plugins: [
		sveltekit(),
		{
			name: 'sveltekit-socket-io',
			configureServer(server) {
				socketHandler(server.httpServer); // <- call the function here
			}
		}
	]
};

export default config;

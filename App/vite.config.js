import { sveltekit } from '@sveltejs/kit/vite';
import socketHandler from './src/socketHandler.js'; // <- Import the new function
import adapter from '@sveltejs/adapter-node';
//similer to webpack config, need the adapter - concerns the dummy server

//svelte kit, we can choose a barebones kit to get us started
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
				//instantiating socker server here
				socketHandler(server.httpServer); // <- call the function here
			}
		}
	]
};

export default config;

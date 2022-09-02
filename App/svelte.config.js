import adapter from '@sveltejs/adapter-node';
//similar to webpack
/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter()
	}
};

export default config;

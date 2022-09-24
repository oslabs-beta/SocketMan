import adapter from '@sveltejs/adapter-node';
//similar to webpack
/** @type {import('@sveltejs/kit').Config} */
export default {
	kit: {
		adapter: adapter()
	}
};

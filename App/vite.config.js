import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-node';
//similer to webpack config, need the adapter - concerns the dummy server

//svelte kit, we can choose a barebones kit to get us started
/** @type {import('vite').UserConfig} */
const config = {
  kit: {
    adapter: adapter(),
  },
  plugins: [sveltekit()],
};

export default config;

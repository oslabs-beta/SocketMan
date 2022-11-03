/*
//triple slash serves as an import for declaration packages.
/// <reference types="vitest" />
*/
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
//import adapter from '@sveltejs/adapter-node';
//similer to webpack config, need the adapter - concerns the dummy server

//Allows us to use IDE intellisense with jsdoc type hints

// export default defineConfig({
//   //following plugin config is used to disable hot module replacement when running tests
//   plugins: [svelte({ hot: !process.env.VITEST }), sveltekit()],
//   //no longer need the kit property in here, kit: {adapter: adapter()} set in svelte.config.js
//   // kit: {
//   //   adapter: adapter(),
//   // },
//   test: {
//     globals: true,
//     environment: 'happy-dom',
//   },
// });

//also need to maybe include types/jest to use it/expect jest matches
//see the following to figure out how to config w/ various properties:
//https://vitest.dev/config/
/** @type {import('vite').UserConfig} */
const config = {
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..'],
    },
  },
  plugins: [sveltekit()],
  test: {
    //call mockReset on all spies b/4 test, clear mock history and reset its implmentation to an empty function
    mockReset: true,
    //simulates a dom environment as if we were in the browser by by providing Browser Api
    environment: 'jsdom',
    //allows us to call beforeAll, afterAll global functions without explicitly importing them
    //will test out
    globals: true,
    //path to setup files.
    setupFiles: 'src/setupTests.ts',
  },
};

export default config;

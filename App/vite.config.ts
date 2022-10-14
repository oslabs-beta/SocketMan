//triple slash serves as an import for declaration packages.
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-node';
//similer to webpack config, need the adapter - concerns the dummy server

//Allows us to use IDE intellisense with jsdoc type hints
/** @type {import('vite').UserConfig} */

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

const config = {
  kit: {
    adapter: adapter(),
  },
  plugins: [sveltekit()],
  test: {
    // Jest like globals
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.ts'],
    // Extend jest-dom matchers
    setupFiles: ['./setupTest.js'],
  },
};

export default config;

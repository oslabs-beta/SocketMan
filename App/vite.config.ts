/*
//triple slash serves as an import for declaration packages.
/// <reference types="vitest" />
*/

import { sveltekit } from '@sveltejs/kit/vite';
//https://vitest.dev/config/
/** @type {import('vite').UserConfig} */
const config = {
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

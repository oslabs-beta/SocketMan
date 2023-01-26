import adapter from '@sveltejs/adapter-netlify';
import preprocess from 'svelte-preprocess';
/** @type {import('@sveltejs/kit').Config} */
export default {
  preprocess: preprocess(),

  kit: {
    adapter: adapter(),
    alias: {
      $lib: 'src/lib',
      $models: 'src/models',
    },
  },
};

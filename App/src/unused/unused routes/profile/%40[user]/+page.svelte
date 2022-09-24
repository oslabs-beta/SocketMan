<script context="module">
  import { create_load } from './_load.js';
  export const load = create_load('articles');
</script>

<script>
  import ArticleList from 'src/unused/ArticleList/index.svelte';

  /** @type {import('./$types').PageData} */
  export let data;
</script>

<ArticleList articles={data.articles} />

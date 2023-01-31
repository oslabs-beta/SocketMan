<script>
  import { socketGlobal } from '../stores';
  import Connect from '../lib/connect/Connect.svelte';
  import Navbar from '../lib/navbar/Navbar.svelte';
</script>

<Navbar />
<main>
  {#if !$socketGlobal}
    <Connect />
  {:else}
    <slot />
  {/if}
</main>

<style>
  main {
    padding: 1rem;
    width: 100%;
    max-width: 1200px;
    margin: auto;
    margin-top: 50px;
    margin-bottom: 50px;
    box-sizing: border-box;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
      rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
      rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
  }

  main * {
    background-color: rgb(209, 209, 209);
    width: 100%;
  }
</style>

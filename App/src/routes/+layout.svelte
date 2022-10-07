<script>
  import '../app.css';

  import { socketGlobal } from '../stores.ts';
  import Connect from '../lib/connect/Connect.svelte';
  import Navbar from '../lib/navbar/Navbar.svelte';
  // define state, subscribe state to store value's changes
</script>

<Navbar />

<!-- Page content goes in SLOT -->
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
    width: 90%;
    max-width: 1024px;
    margin: auto;
    margin-top: 50px;
    box-sizing: border-box;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
      rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
      rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
  }
  main * {
    background-color: rgb(209, 209, 209);
    width: 100%;
  }

  footer {
    width: 100%;
    position: absolute;
    bottom: 0;
    background-color: rgb(108, 221, 255);
    height: 30px;
  }

  /* @media (min-width: 480px) {
    footer {
      padding: 40px 0;
    }
  } */
</style>

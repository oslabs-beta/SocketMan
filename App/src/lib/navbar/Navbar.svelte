<script>
  import '../../app.css';
  import { socketGlobal } from '../../stores';

  const disconnect = () => {
    $socketGlobal.close();
    socketGlobal.update(() => null);
  };
</script>

<nav>
  {#if $socketGlobal}
    <nav-left>
      <a href="/">Listen 🎧</a>
      <a href="/socketman">Socketman 🚀</a>
    </nav-left>
    <nav-right>
      <button type="button" on:click={disconnect}>Disconnect</button>
    </nav-right>
  {/if}
</nav>

<style>
  nav {
    display: flex;
    justify-content: space-between;
    height: 50px;
    background-color: rgb(64, 64, 64);
    padding: 0 30px;
  }
  nav * {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  nav-left * {
    text-align: center;
    padding: 0 20px;
  }
</style>

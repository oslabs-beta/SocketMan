<script>
  import '../../app.css';
  import { socketGlobal } from '../../stores';
  // import { socketGlobal } from '../../stores';
  // import { socketGlobal } from '../../stores';
  // import { socketGlobal } from '../../stores';
  //following imported to create dark/light mode button
  import IconButton from '@smui/icon-button';
  import {} from '@mdi/js';
  import { Svg } from '@smui/common/elements';

  const disconnect = () => {
    //reset allEventsGlobal, isFiltered, and filteredEvents arr when user disconnect
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
      <IconButton on:click={() => clicked++}>
        <Icon component={Svg} viewBox="0 0 24 24">
          <path fill="currentColor" d={mdiFormatColorFill} />
        </Icon>
      </IconButton>
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
    color: #ff9900;
  }
</style>

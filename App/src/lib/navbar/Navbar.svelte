<script>
  import '../../app.css';
  import { socketGlobal } from '../../stores';
  import { onMount } from 'svelte';
  //following imported to create dark/light mode button
  import IconButton, { Icon } from '@smui/icon-button';
  import {} from '@mdi/js';
  import { Svg } from '@smui/common/elements';
  import { mdiWeatherSunny } from '@mdi/js';
  import { mdiMoonWaxingCrescent } from '@mdi/js';

  const disconnect = () => {
    //reset allEventsGlobal, isFiltered, and filteredEvents arr when user disconnect
    $socketGlobal.close();
    socketGlobal.update(() => null);
  };
  let darkTheme = undefined;

  onMount(() => {
    darkTheme = window.matchMedia('prefers-color-scheme: light');
  });
</script>

<svelte:head>
  <!-- SMUI Styles -->
  <link rel="stylesheet" href="/all.css" />
  {#if darkTheme === undefined}
    <link
      rel="stylesheet"
      href="/smui.css"
      media="(prefers-color-scheme: light)"
    />
    <link
      rel="stylesheet"
      href="/smui-dark.css"
      media="screen and (prefers-color-scheme: dark)"
    />
  {:else if darkTheme}
    <!-- <link rel="stylesheet" href="/smui-dark.css" media="screen" /> -->
    <link rel="stylesheet" href="/dark.css" media="screen" />
  {:else}
    <link rel="stylesheet" href="/smui.css" />
  {/if}
</svelte:head>

<nav>
  {#if $socketGlobal}
    <nav-left>
      <a href="/">Listen 🎧</a>
      <a href="/emit">Emit 🚀</a>
    </nav-left>
    <nav-right>
      <IconButton
        on:click={() => (darkTheme = !darkTheme)}
        title={darkTheme ? 'Lights on.' : 'Lights off.'}
      >
        <Icon component={Svg} viewBox="0 0 24 24">
          <path
            fill="yellow"
            d={darkTheme ? mdiWeatherSunny : mdiMoonWaxingCrescent}
          />
        </Icon>
      </IconButton>
      <button type="button" on:click={disconnect}>Disconnect</button>
    </nav-right>
  {/if}
</nav>

<!-- <style>
  nav {
    display: flex;
    justify-content: space-between;
    height: 60px;
    /* background-color: rgb(64, 64, 64); */
    padding: 0 30px;
  }
  nav * {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  nav-left * {
    text-align: center;
    padding: 10px;
    color: #ff9900;
    text-decoration: none;
    margin: 10px;
  }
</style> -->

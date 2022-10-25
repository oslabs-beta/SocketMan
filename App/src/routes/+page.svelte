<script lang="ts">
  import Feed from '../lib/feed/feed.svelte';
  import {
    allEventsGlobal,
    displayRulesGlobal,
    displayEventsGlobal,
    arrayOfEventNamesGlobal,
    arrayOfSocketIdsGlobal,
    arrayOfDirectionsGlobal,
    selectedDirectionGlobal,
    selectedEventNamesGlobal,
    selectedSocketIdsGlobal,
  } from '../stores';

  function filter(): void {
    displayEventsGlobal.update(() => {
      console.log('..filter invoked');
      return $allEventsGlobal
        .filter((event) => $selectedEventNamesGlobal.includes(event.eventName))
        .filter((event) => {
          return $selectedDirectionGlobal.includes(event.direction);
        })
        .filter((event) => {
          return $selectedSocketIdsGlobal.includes(event.socketId);
        });
    });
  }
  function filterTsWorkaround(e: any, filterArg: string): void {
    $displayRulesGlobal[filterArg] = e.target.checked;
    filter();
  }
</script>

<svelte:head>
  <title>GUI Client</title>
  <meta name="description" content="GUI dashboard" />
</svelte:head>

<!-- LISTENERS SECTION -->
<section>
  <h1>Events Log</h1>
  {#if $allEventsGlobal.length}
    <h4>Filters</h4>
    <div class="filters">
      <div>Event Name:</div>
      {#each $arrayOfEventNamesGlobal as eventName}
        <label>
          <input
            type="checkbox"
            bind:group={$selectedEventNamesGlobal}
            value={eventName}
            on:change={(e) => filterTsWorkaround(e, eventName)}
          />
          "{eventName}"
        </label>
      {/each}
    </div>
    <div class="filters">
      <div>SocketId:</div>
      {#each $arrayOfSocketIdsGlobal as socketId}
        <label>
          <input
            type="checkbox"
            bind:group={$selectedSocketIdsGlobal}
            value={socketId}
            on:change={(e) => filterTsWorkaround(e, socketId)}
          />
          "{socketId}"
        </label>
      {/each}
    </div>
    <div class="filters">
      <div>Direction:</div>
      {#each $arrayOfDirectionsGlobal as direction}
        <label>
          <input
            type="checkbox"
            bind:group={$selectedDirectionGlobal}
            value={direction}
            on:change={(e) => filterTsWorkaround(e, direction)}
          />
          "{direction}"
        </label>
      {/each}
    </div>
  {/if}
  <div id="events">
    {#if $displayEventsGlobal.length}
      <Feed />
    {:else}
      <p>No event yet</p>
    {/if}
  </div>
</section>

<style>
  button {
    margin-top: 10px;
  }
  .filters {
    border: 1px solid;
    border-radius: 2%;
    border-color: gray;
  }
</style>
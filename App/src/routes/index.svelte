<script>
  //need to import the other component we wish to use
  import Event from '../lib/event.svelte';
  import { eventsIncomingGlobal } from '../stores';
  import { eventsOutgoingGlobal } from '../stores';

  function removeEvent(e) {
    //each function has a direction property in order
    //sometimes timestamps would be the exact same so we have to check multiple properies
    if (e.detail.direction === 'outgoing') {
      eventsOutgoingGlobal.update(() => {
        return $eventsOutgoingGlobal.filter((event) => {
          if (
            event[2] === e.detail.timestamp &&
            event[0] === e.detail.socketId
          ) {
            if (event[1][0] === e.detail.eventname) {
              return false;
            }
          }
          return true;
        });
      });
    } else if (e.detail.direction === 'incoming') {
      eventsIncomingGlobal.update(() => {
        return $eventsIncomingGlobal.filter((event) => {
          if (
            event[2] === e.detail.timestamp &&
            event[0] === e.detail.socketId
          ) {
            if (event[1][0] === e.detail.eventname) {
              return false;
            }
          }
          return true;
        });
      });
    }
  }
</script>

<svelte:head>
  <title>GUI Client</title>
  <meta name="description" content="GUI dashboard" />
</svelte:head>

<!-- LISTENERS SECTION -->
<section>
  <h1>GUI Events</h1>
  <div id="events">
    <div id="outgoing">
      {#if $eventsOutgoingGlobal.length === 0}
        <p class="no-events">No outgoing events</p>
      {:else}
        <p>Outgoing Events:</p>
        <!-- sveltes index loop -->
        <!-- creating a new li element containing the Event component -->
        <!-- setting a listener for the event name removeEvent - which will be dispatched from event component -->
        {#each $eventsOutgoingGlobal as event}
          <li>
            <Event
              eventname={event[1][0]}
              payload={event[1].slice(1)}
              timestamp={event[2]}
              socketId={event[0]}
              direction="outgoing"
              on:removeEvent={removeEvent}
            />
          </li>
        {/each}
      {/if}
    </div>
    <div id="incoming">
      {#if $eventsIncomingGlobal.length === 0}
        <p class="no-events">No incoming events</p>
      {:else}
        <p>Incoming Events:</p>
        {#each $eventsIncomingGlobal as event}
          <li>
            <Event
              eventname={event[1][0]}
              payload={event[1].slice(1)}
              timestamp={event[2]}
              socketId={event[0]}
              direction="incoming"
              on:removeEvent={removeEvent}
            />
          </li>
        {/each}
      {/if}
    </div>
  </div>
  <!-- bind:value - changes to the input value will update the connectTo value and changes to connectTo value will update input -->
</section>

<style>
  #events {
    display: grid;
    grid-template-columns: 5fr 0.3fr 5fr;
    grid-template-rows: auto;
    grid-template-areas: 'outgoing gap incoming';
  }

  #events > #outgoing {
    grid-area: outgoing;
    list-style-type: none;
    margin-top: 20px;
    font-size: medium;
  }

  #events > #outgoing > li {
    padding: 0.5rem 1rem;
    background: #fff;
  }

  #events > #outgoing > li:nth-child(odd) {
    background: #ccc;
  }

  #events > #incoming {
    grid-area: incoming;
    list-style-type: none;
    margin-top: 20px;
    font-size: medium;
  }

  #events > #incoming > li {
    padding: 0.5rem 1rem;
    background: #fff;
  }

  #events > #incoming > li:nth-child(odd) {
    background: #ccc;
  }
  .no-events {
    text-align: center;
  }
</style>

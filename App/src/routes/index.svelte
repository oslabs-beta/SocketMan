<script>
  //need to import the other component we wish to use
  import Event from '../lib/event.svelte';

  //primary arr to display all incoming events
  import { allEventsGlobal } from '../stores';
  //   let allEvents = [];
  //arr rendered when user switches view between event name, socketId, incoming or outgoing
  import { filteredEventsGlobal } from '../stores';
  //   let filteredEvents = [];
  import { isFilteredGlobal } from '../stores';
  //   let isFiltered = false;

  //change to a single filterVariable
  import { filterEventNameGlobal } from '../stores';
  import { socketIdGlobal } from '../stores';



  //instantiate maybe a single variable 
  //get emitted event to display with everything else
  function removeEvent(e) {
    //each function has a direction property in order
    //sometimes timestamps would be the exact same so we have to check multiple properies
    if (e.detail.direction === 'outgoing') {
      eventsOutgoing = eventsOutgoing.filter((event) => {
        if (event[2] === e.detail.timestamp && event[0] === e.detail.socketId) {
          if (event[1][0] === e.detail.eventname) {
            return false;
          }
        }
        return true;
      });
    } else if (e.detail.direction === 'incoming') {
      eventsIncoming = eventsIncoming.filter((event) => {
        if (event[2] === e.detail.timestamp && event[0] === e.detail.socketId) {
          if (event[1][0] === e.detail.eventname) {
            return false;
          }
        }
        return true;
      });
    }
  }

  //filter functionality for different views (event based, and socketID)
  //each function reassigns filteredEvents arr based on user's desired setting
  //maybe want to explore sorting by time incoming, alphabetical (for event name), or whether or not event contains callbacl
  function filterEventName(eventName) {
    isFilteredGlobal.set(true);
    filteredEventsGlobal.update(() => {
      return $allEventsGlobal.filter((event) => event.eventName === eventName);
    });
  }
  function filterSocketID(socketid) {
    isFilteredGlobal.set(true);
    console.log('global socketId is =>', $socketIdGlobal);
    filteredEventsGlobal.update(() => {
      return $allEventsGlobal.filter((event) => event.socketId === socketid);
    });
  }
  function filterIncoming() {
    isFilteredGlobal.set(true);
    filteredEventsGlobal.update(() => {
      return $allEventsGlobal.filter((event) => event.direction === 'incoming')
    })
  }
  function filterOutgoing() {
    isFilteredGlobal.set(true);
    filteredEventsGlobal.update(() => {
      return $allEventsGlobal.filter((event) => event.direction === 'outgoing')
    })
  }
</script>

<svelte:head>
  <title>GUI Client</title>
  <meta name="description" content="GUI dashboard" />
</svelte:head>

<!-- LISTENERS SECTION -->
<section>
  <h1>GUI Events</h1>
  <!-- following button necessary in order to reset the isFiltered boolean and resetting filteredEvents to empty arr -->
  <button
    id="test"
    on:click={() => {
      isFilteredGlobal.set(false);
      filteredEventsGlobal.set([]);
    }}>CLICK TO DISPLAY ALL EVENTS</button
  >
  <button
    id="test"
    on:click={() => {
      filterIncoming();
    }}>CLICK TO FILTER INCOMING</button
  >
  <button
    id="test"
    on:click={() => {
      filterOutgoing();
    }}>CLICK TO FILTER OUTGOING</button
  >
  <form>
    <input 
    placeholder= "Enter event name"
    bind:value= {$filterEventNameGlobal}
    >
    <button
    id="test"
    on:click|preventDefault={() => {
      filterEventName($filterEventNameGlobal);
    }}>CLICK TO FILTER EVENT NAME</button
    >
  </form>
  

  <form id = 'socketId'>
    <input 
    placeholder= "Enter socket id"
    on:change={(e) => {
      socketIdGlobal.set(e.target.value);
    }}
    >
    <button
      id="test"
      on:click|preventDefault={() => {
        filterSocketID($socketIdGlobal);
      }}>CLICK TO FILTER ID</button
    >
  </form>

  <!-- above socketID is hardcoded -->
  <div id="events">
    <!-- if user view switches (by event name, socketId or other), iterate through filtered events, else, iterate and render all events -->
    <!-- creating a new li element containing the Event component -->
    <!-- setting a listener for the event name removeEvent - which will be dispatched from event component -->
    {#each $isFilteredGlobal ? $filteredEventsGlobal : $allEventsGlobal as event}
      <li>
        <Event
          eventname={event.eventName}
          payload={event.payload}
          timestamp={event.date}
          socketId={event.socketId}
          direction={event.direction}
          on:removeEvent={removeEvent}
        />
      </li>
    {/each}
  </div>
  <!-- bind:value - changes to the input value will update the connectTo value and changes to connectTo value will update input -->
</section>

<style>
  #events {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    grid-template-areas: 'outgoing gap incoming';
  }

  #events > li {
    padding: 0.5rem 1rem;
    background: #ccc;
  }

  #events > li:nth-child(odd) {
    background: #ccc;
  }

  #events > li {
    padding: 0.5rem 1rem;
    background: #fff;
  }

  #events > li:nth-child(odd) {
    background: #ccc;
  }
  .no-events {
    text-align: center;
  }
</style>

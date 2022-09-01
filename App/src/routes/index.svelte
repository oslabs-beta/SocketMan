<script>
  import Feed from '../lib/feed/feed.svelte';
  // import Switch from '@smui/switch';
  import Switch from '../lib/switch.svelte';
  import FormField from '@smui/form-field';
  import Button from '@smui/button';
  //primary arr to display all incoming events
  import { allEventsGlobal } from '../stores';
  //arr rendered when user switches view between event name, socketId, incoming or outgoing
  import { filteredEventsGlobal } from '../stores';
  import { isFilteredGlobal } from '../stores';
  import { filterEventNameGlobal } from '../stores';
  import { socketIdGlobal } from '../stores';

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
  //following functionality for sorting 
  function sortAlphabetical() {
    console.log('invoked!')
    //iterate through filtered array global by alphabetical order and reassign filtered
    filteredEventsGlobal.update(() => {
      //need to instantiate a check for either allEvent or filteredArr
     return $filteredEventsGlobal.sort((a, b) => {
      console.log('sorting...', a.eventName);
        const eventA = a.eventName.toUpperCase();
        const eventB = b.eventName.toUpperCase();
         if (eventA < eventB){
          return -1;
         } 
         if (eventA > eventB) {
          return 1;
         }
         return 0;
      })
    })
  }
  //NEED TO FIX
  //checks to see if events have a callback
  function sortCallback() {
   return filteredEventsGlobal.update(() => {
      $filteredEventsGlobal.filter((event) => event.cb)
    })
  }
  function sortTimestamp (){
   return filterEventNameGlobal.update(() => {
      $filteredEventsGlobal.sort((eventA, eventB) => {
        return eventA.date - eventB.date;
      })
    })
  }
  //array of obj for options
  const sortingOptions = [
    {
      name: 'Alphabetically',
      disabled: false
    }, 
    {
      name: 'Timestamp',
      disabled: false
    }, 
    {
      name: 'Callback Included',
      disabled: false
    } 
];
//array to display selected
  let selected = [];
</script>

<svelte:head>
  <title>GUI Client</title>
  <meta name="description" content="GUI dashboard" />

  <link
  rel="stylesheet"
  href="https://fonts.googleapis.com/icon?family=Material+Icons"
/>
<!-- Roboto -->
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700"
/>
<!-- Roboto Mono -->
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css?family=Roboto+Mono"
/>
<link rel="stylesheet" href="/smui.css" />
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
  <form id='filter-eventName'>
    <input 
    placeholder= "Enter event name"
    on:change={(e) => {
      filterEventNameGlobal.set(e.target.value);
    }}
    >
    <button
    id="test"
    on:click|preventDefault={() => {
      filterEventName($filterEventNameGlobal);
    }}>CLICK TO FILTER EVENT NAME</button
    >
  </form>
  <form id = 'filter-socketId'>
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

 <button
  id ='test'
  on:click={() => {
    sortTimestamp();
  }}>Click to sort by timestamp
 </button>

 <button
 id ='test'
  on:click={() => {
    sortAlphabetical();
  }}>Click to sort by event-name 
</button>

<button
  id ='test'
  on:click={() => {
    sortCallback();
  }}>Click to view all events with callbacks
</button>

<!-- SMUI ATTEMPT -->
  <!-- <div id='sorting' style="display:flex" >
    {#each sortingOptions as option}
      <div>
        <FormField>
          <Switch
            bind:group={selected}
            value={option.name}
            disabled={option.disabled}
          />
          <span slot="label"
            >{option.name}{option.disabled ? ' (disabled)' : ''}</span
          >
        </FormField>
      </div>
    {/each}

    <pre class="status">Sort by: {selected.join(', ')}</pre>

    <div style="margin-top: 1em;">
      <Button
        on:click={() => {
          const idx = selected.indexOf('Doc');
          if (idx > -1) {
            selected.splice(idx, 1);
          } else {
            selected.push('Doc');
          }
          selected = selected;
        }}
      >
        Sort
      </Button>
    </div>
  </div> -->

  <div id="events">
    <Feed />
    <!-- {#each $isFilteredGlobal ? $filteredEventsGlobal : $allEventsGlobal as event}
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
    {/each} -->
  </div>
</section>

<style>
  /* #events {
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
  } */
</style>

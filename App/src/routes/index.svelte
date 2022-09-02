<script>
  import Feed from '../lib/feed/feed.svelte';
  import Switch from '@smui/switch';
  // import Switch from '../lib/switch.svelte';
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
  //maybe want to explore sorting by time incoming, alphabetical (for event name), or whether or not event contains callback
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
  //following functionality for sorting events by event name A-Z
  function sortAlphabetical() {
    //iterate through filtered array global by alphabetical order and reassign filtered
    let sorted;
    sorted = $isFilteredGlobal ? $filteredEventsGlobal.slice() : $allEventsGlobal.slice();
    filteredEventsGlobal.update(() => {
      //need to instantiate a check to see if we are in display view 
     return sorted.sort((a, b) => {
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
    console.log('sorted after update is=>', sorted)
  }
  //array of obj for options
  const sortingOptions = [
    {
      name: 'Alphabetically',
      disabled: false
    }
];
//array to display selected
  let selected = [];
</script>

<svelte:head>
  <title>GUI Client</title>
  <meta name="description" content="GUI dashboard" />
</svelte:head>

<!-- LISTENERS SECTION -->
<section>
  <h1>Events Log</h1>
  <!-- following button necessary in order to reset the isFiltered boolean and resetting filteredEvents to empty arr -->
  <button
    id="test"
    on:click={() => {
      isFilteredGlobal.set(false);
      filteredEventsGlobal.set($allEventsGlobal.slice());
      console.log('filter events is reset =>', $filteredEventsGlobal);
      console.log('isFiltered =>', $isFilteredGlobal);
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
    sortAlphabetical();
  }}>Click to sort by event-name 
</button>


<!-- SMUI ATTEMPT -->
  <div id ='sort-section'>
    <div id='switch'>
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
      <!-- <pre >Sort by: {selected.join(', ')}</pre> -->
      <div >
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
      </div>
    </div>
  <div id="events">
    <Feed />
  </div>
</section>

<style>
  #sort-section {
    display: flex;
    flex-direction: row;
  }
</style>

<script>
  import Feed from '../lib/feed/feed.svelte';
  import Switch from '@smui/switch';
  // import Switch from '../lib/switch.svelte';
  import FormField from '@smui/form-field';
  import Button from '@smui/button';
  //primary arr to display all incoming events
  import { allEventsGlobal, isFilteredGlobal, filterEventNameGlobal,socketIdGlobal, displayRules, displayEventsGlobal, arrayOfEventNamesGlobal, arrayOfSocketIdsGlobal, arrayOfDirectionsGlobal } from '../stores';
  //arr rendered when user switches view between event name, socketId, incoming or outgoing
  // import { } from '../stores';
  // import {  } from '../stores';
  // import { } from '../stores';
  import { onMount } from 'svelte';
  
  console.log('Object.keys($displayRules)[0]==>', Object.keys($displayRules)[0])

  let arrayOfEventNames; 
  let arrayOfSocketIds;
  let arrayOfDirections;

  arrayOfEventNamesGlobal.subscribe(value => {
    arrayOfEventNames = value;
	});


  arrayOfSocketIdsGlobal.subscribe(value => {
    arrayOfSocketIds = value;
	});

  arrayOfDirectionsGlobal.subscribe(value => {
    arrayOfDirections = value;
	});


		
  if (!Object.keys($displayRules)[0]){
    allEventsGlobal.subscribe(value => {
      $displayEventsGlobal = value;
	});
  }
     
function filter(){
  displayEventsGlobal.update(() => {
      return $allEventsGlobal.filter(
        (event) => arrayOfEventNames.includes(event.eventName)).filter(
          (event)=>{
            return arrayOfDirections.includes(event.direction)
        }).filter((event)=>{
          return arrayOfSocketIds.includes(event.socketId)
        });
    });
}

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
  
  //following functionality for sorting events by event name A-Z
  function sortAlphabetical() {
    //iterate through filtered array global by alphabetical order and reassign filtered
    let sorted;
    sorted = $isFilteredGlobal ? $displayEventsGlobal.slice() : $allEventsGlobal.slice();
    displayEventsGlobal.update(() => {
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
  {#if $allEventsGlobal.length}
  <h4>Filters</h4>
  <div class="filters">
  <div>Event Name: </div>
  {#each $arrayOfEventNamesGlobal as eventName}
    <label>
      <input type=checkbox bind:group={arrayOfEventNames} value={eventName} on:change={filter}>
      "{eventName}"
    </label>
  {/each}
  </div>
  <div class="filters">
    <div>Socket ID: </div>
    {#each $arrayOfSocketIdsGlobal as socketId}
      <label>
        <input type=checkbox bind:group={arrayOfSocketIds} value={socketId} on:change={filter}>
        {socketId}
      </label>
    {/each}
    </div>
    <div class="filters">
      <div>Direction: </div>
      {#each $arrayOfDirectionsGlobal as direction}
        <label>
          <input type=checkbox bind:group={arrayOfDirections} value={direction} on:change={filter}>
          {direction[0].toUpperCase()+direction.slice(1)}
        </label>
      {/each}
      </div>
  {/if}
  <!-- following button necessary in order to reset the isFiltered boolean and resetting filteredEvents to empty arr -->
  
  
  <!-- <form id='filter-eventName'>
    <input 
    placeholder= "Enter event name"
    on:change={(e) => {
      filterEventNameGlobal.set(e.target.value);
    }}
    > -->
    <!-- <button
    id="test"
    on:click|preventDefault={() => {
      filterEventName($filterEventNameGlobal);
    }}>CLICK TO FILTER EVENT NAME</button
    > -->
  <!-- </form> -->
  <!-- <form id = 'filter-socketId'>
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
  </form> -->
 <!-- <button
 id ='test'
  on:click={() => {
    sortAlphabetical();
  }}>Sort by Event Name - Alphabetically 
</button> -->


<!-- SMUI SWITCH ATTEMPT TO SORTING  -->
  <!-- <div id ='sort-section'>
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
  </div> -->
    
  <div id="events">
    {#if $displayEventsGlobal.length}
    <Feed />
    {:else}
    <p>No event yet</p>
    {/if}
  </div>
</section>

<style>
  /* #sort-section {
    display: flex;
    flex-direction: row;
  } */
  button{
    margin-top: 10px;
  }

  .filters{
    border: 1px solid;
    border-radius: 2%;
    border-color: gray;
  }
</style>

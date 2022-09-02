<script>
  import Event from '../feed/event.svelte'; 
  import Accordion from '@smui-extra/accordion';
  import { filteredEventsGlobal, isFilteredGlobal, allEventsGlobal } from '../../stores';
	import { onMount } from 'svelte';
  //export let is how we access props attached to the event component
   let socketId;
   let eventname;
   let payload;
   let timestamp; 
    //direction does not render in event component but it is received for removeEvent functionality on index.svelte
    let direction;
    // //instantiate eventsArr to 
    // let eventsArr = [];
    // onMount(() => {
    //   eventArr = $isFilteredGlobal? $filteredEventsGlobal.slice() : $allEventsGlobal.slice()
    // })

</script>

<section>
  <div id="events">
        <Accordion >
          {#each $filteredEventsGlobal as event}
            <Event
              eventname={event.eventName}
              payload={event.payload}
              timestamp={event.date}
              socketId={event.socketId}
              direction={event.direction}
            />
          {/each}
        </Accordion>
  </div>
  
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
<script>
   import Event from '../feed/event.svelte'; 
//primary arr to display all incoming events
  import { allEventsGlobal } from '../../stores';
  //arr rendered when user switches view between event name, socketId, incoming or outgoing
  import { filteredEventsGlobal } from '../../stores';
  import { isFilteredGlobal } from '../../stores'

  //export let is how we access props attached to the event component
   let socketId;
   let eventname;
   let payload;
   let timestamp; 
    //direction does not render in event component but it is received for removeEvent functionality on index.svelte
    let direction;
</script>

<section>
    <div id="events">
    <!-- if user view switches (by event name, socketId or other), iterate through filtered events, else, iterate and render all events -->
    <!-- creating a new li element containing the Event component -->
    <!-- setting a listener for the event name removeEvent - which will be dispatched from event component -->
    {#each $filteredEventsGlobal as event}
      <li>
        <Event
          eventname={event.eventName}
          payload={event.payload}
          timestamp={event.date}
          socketId={event.socketId}
          direction={event.direction}
        />
      </li>
    {/each}
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
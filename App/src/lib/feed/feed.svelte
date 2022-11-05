<script>
  import Event from '../feed/event.svelte';
  import Accordion from '@smui-extra/accordion';
  import { displayEventsGlobal } from '../../stores';
  console.log($displayEventsGlobal);
</script>

<section>
  <div id="events" data-testid="all-events">
    <Accordion color="secondary">
      {#each $displayEventsGlobal as event}
        <Event
          eventname={event.eventName}
          payload={event.payload}
          timestamp={event.date}
          socketId={event.socketId}
          direction={event.direction}
          namespace={event.nsp}
          rooms={event.rooms}
        />
      {/each}
    </Accordion>
  </div>
</section>

<style>
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

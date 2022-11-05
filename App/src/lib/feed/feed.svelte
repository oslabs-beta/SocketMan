<script>
  import Event from '../feed/event.svelte';
  import Accordion from '@smui-extra/accordion';
  import { displayEventsGlobal } from '../../stores';
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

<script lang="ts">
  import type { savedEventsObj } from '$lib/types';

  //export let is how we access props attached to the event component
  export let savedEventsObj: savedEventsObj;
  export let loadEvent: (
    event: Event & { currentTarget: EventTarget & HTMLSelectElement }
  ) => any;
  export let selectedEvent: string;
</script>

<select id="save-list" on:change={loadEvent} value={selectedEvent}>
  <option selected />
  {#each Object.keys(savedEventsObj) as event}
    <option>{event}</option>
  {/each}
</select>

<style>
  #save-list {
    padding: 5px;
  }
</style>

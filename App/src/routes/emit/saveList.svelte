<script>
  export let savedEventsObj;
  export let loadEvent;
  export let selectedEvent;
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

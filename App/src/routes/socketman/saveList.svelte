<script>
  //export let is how we access props attached to the event component
  export let savedEvents;
  export let loadEvent;
  export let selectedEvent;
</script>

<select
  id="save-list"
  on:change={loadEvent}
  value={selectedEvent ? selectedEvent : ''}
>
  <option selected />
  {#each Object.keys(savedEvents) as event}
    <option>{event}</option>
  {/each}
</select>

<style>
  #save-list {
    padding: 5px;
  }
</style>

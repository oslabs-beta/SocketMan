<script>
    import { createEventDispatcher } from 'svelte';
  
    const dispatch = createEventDispatcher();
  
    export let socketId;
    export let eventname;
    export let payload;
    export let timestamp; 
    export let direction;

    const onDelete = () => {
    console.log('onDelete called')
    dispatch('removeEvent', {timestamp, socketId, eventname, direction})};
</script>
  
<style>
  #event{
      margin: 0;
	  padding-bottom: 3rem;
	  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
	  Helvetica, Arial, sans-serif;
  }
  
  .event-property{
      font-size: small;
      color:cornflowerblue;
  }

  .event-value{
      font-size:small;
      color:midnightblue;
  } 
</style>
  
  <div id='event'>
    <div class='event-property'> Socket Id: <span class="event-value">{socketId}</span><span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><button on:click={onDelete}>Delete</button>
</div>
    <div class='event-property'> Timestamp: <span class="event-value">{timestamp}</span></div>
    <div class='event-property'> Eventname: <span class="event-value">{eventname}</span></div>
    <div class='event-property'> Payload: <span class="event-value">{payload}</span></div>
</div>
  
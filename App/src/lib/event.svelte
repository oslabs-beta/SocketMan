<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

  //export let is how we access props attached to the event component
    export let socketId;
    export let eventname;
    export let payload;
    export let timestamp; 
    //direction does not render in event component but it is received for removeEvent functionality on index.svelte
    export let direction;

    const onDelete = () => {
    //remove event is defined on index.svelte
    //everything inside second param is going to be in e.detail => see line 152 on index.svelte
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
<!-- reassign direction with arrow(green or red) to signal incoming or outgoing -->
    <div class= 'event-property'><span class="event-value">{direction}</span></div>
    <div class='event-property'> Timestamp: <span class="event-value">{timestamp}</span></div>
    <div class='event-property'> Eventname: <span class="event-value">{eventname}</span></div>
    <div class='event-property'> Payload: <span class="event-value">{payload}</span></div>
</div>
  
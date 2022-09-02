<script>
    import { createEventDispatcher } from 'svelte';
    import{ Panel, Header, Content } from '@smui-extra/accordion';
    const dispatch = createEventDispatcher();

  //export let is how we access props attached to the event component
    export let socketId;
    export let eventname;
    export let payload;
    export let timestamp; 
    //direction does not render in event component but it is received for removeEvent functionality on index.svelte
    export let direction;

      //remove event is defined on index.svelte
    //everything inside second param is going to be in e.detail => see line 152 on index.svelte
    const onDelete = () => {
  
    dispatch('removeEvent', {timestamp, socketId, eventname, direction})};
    const previewPayload = () => {

    }
  
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

  .arrow-up{
    color:seagreen
  }

  .arrow-down{
    color:orangered
  }

  .event-value{
      font-size:small;
      color:midnightblue;
  } 
</style>
  <div class='events'>
    <Panel>
      <Header>
        Socket ID: {socketId}
        {#if direction ==='incoming'}
          <span class='arrow-up'>⬆</span>
        {:else}
        <span class='arrow-down'>⬇</span>
        {/if}
      </Header>
    <Content>
      <ul>
        <li>Event Name:{eventname}</li>
        <li>Payload: {payload}</li>
        <li>Timestamp: {timestamp}</li>
      </ul>
    </Content>
    </Panel>
  </div>
  
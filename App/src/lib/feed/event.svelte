<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Panel, Header, Content } from '@smui-extra/accordion';
  const dispatch = createEventDispatcher();
  export let socketId: string;
  export let eventname: string;
  export let payload: any[];
  export let timestamp: number;
  export let namespace: string;
  export let rooms: Set<string>;
  //direction rendered as up or down arrows but it is received for removeEvent functionality on index.svelte
  export let direction: string;

  //NO LONGER DELETING FOR NOW
  //remove event is defined on index.svelte
  //everything inside second param is going to be in e.detail => see line 152 on index.svelte
  const onDelete = () => {
    dispatch('removeEvent', { timestamp, socketId, eventname, direction });
  };
</script>

<Panel>
  <Header>
    <div class="accordion-preview">
      <span>
        <emph>
          {`${direction === 'incoming' ? 'Emitter' : 'Recipient'} Socket ID:`}
        </emph>
        {socketId}
      </span>
      <span class="name">
        <emph> Event: </emph>
        {eventname}
      </span>
      <span>
        <emph> Time: </emph>
        {new Date(timestamp).toLocaleString()}
        {#if direction === 'incoming'}
          <span class="arrow-down">⇣</span>
        {:else if direction !== 'Socketman'}
          <span class="arrow-up">⇡</span>
        {:else}
          <span class="socketman">👨‍🔬</span>
        {/if}
      </span>
    </div>
  </Header>
  <Content>
    <ul>
      <li>Event Name:{eventname}</li>
      <li>Payload: {payload}</li>
      <li>Timestamp: {new Date(timestamp)}</li>
      <li>Namespace: {namespace}</li>
      <li>Rooms: {Array.from(rooms).join(', ')}</li>
    </ul>
  </Content>
</Panel>

<style>
  emph {
    font-weight: 700;
    color: rgb(71, 136, 220);
  }
  #event {
    margin: 0;
    padding-bottom: 3rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      Helvetica, Arial, sans-serif;
  }

  .name {
    width: 30%;
  }
  .accordion-preview {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }

  .event-property {
    font-size: small;
    color: cornflowerblue;
  }

  .arrow-up {
    margin-left: 10px;
    font-size: xx-large;
    font-weight: 900;
    color: seagreen;
  }

  .arrow-down {
    margin-left: 10px;
    font-size: xx-large;
    font-weight: 900;
    color: orangered;
  }
  .socketman {
    /* margin-left: 10px; */
    font-size: x-large;
    font-weight: 900;
    color: orangered;
  }

  .event-value {
    font-size: small;
    color: midnightblue;
  }
</style>

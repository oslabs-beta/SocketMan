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
  const joinedPayload: string = payload.join(', ');
  const roomsArr: string = Array.from(rooms).join(', ');
</script>

<Panel data-testid="rendered-event">
  <Header>
    <div class="accordion-preview">
      <span>
        <emph>
          {`${direction === 'outgoing' ? 'Recipient' : 'Emitter'} Socket ID:`}
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
    <ul data-testid="event-info">
      <li><b>Event Name:</b> {eventname}</li>
      <li><b>Payload:</b> {payload.join(', ')}</li>
      <li><b>Timestamp:</b> {new Date(timestamp)}</li>
      <li><b>Namespace:</b> {namespace}</li>
      <li>
        <b>Rooms:</b>
        {direction === 'Socketman' ? 'Socketman' : Array.from(rooms).join(', ')}
      </li>
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

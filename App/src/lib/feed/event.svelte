<script lang="ts">
  import { Panel, Header, Content } from '@smui-extra/accordion';
  export let socketId: string;
  export let eventname: string;
  export let payload: any[];
  export let timestamp: number;
  export let namespace: string;
  export let rooms: Set<string>;
  //direction rendered as up or down arrows but it is received for removeEvent functionality on index.svelte
  export let direction: string;
</script>

<Panel class="single-events" data-testid="rendered-event">
  <Header class="header-acc">
    <div class="accordion-preview">
      <span>
        <emph id="event-title">
          {`${direction === 'outgoing' ? 'Recipient' : 'Emitter'} Socket ID:`}
        </emph>
        {socketId}
      </span>
      <span class="name">
        <emph id="event-title"> Event: </emph>
        {eventname}
      </span>
      <span>
        <emph id="event-title"> Time: </emph>
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
  .name {
    width: 30%;
  }
  .accordion-preview {
    display: flex;
    width: 100%;
    justify-content: space-between;
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
    font-size: x-large;
    font-weight: 900;
    color: orangered;
  }
</style>

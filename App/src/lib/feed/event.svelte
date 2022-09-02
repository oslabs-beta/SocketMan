<script>
  import { createEventDispatcher } from 'svelte';
  import { Panel, Header, Content } from '@smui-extra/accordion';
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
    dispatch('removeEvent', { timestamp, socketId, eventname, direction });
  };
  const previewPayload = () => {};
</script>

<div class="events">
  <Panel>
    <Header>
      <div class="accordion-preview">
        <span>
          <emph> Socket ID: </emph>
          {socketId}
        </span>
        <span class="name">
          <emph> Event: </emph>
          {eventname}
        </span>
        <span>
          <emph> Time: </emph>
          {timestamp}
        </span>
      </div>
    </Header>
    <Content>
      <ul>
        <li>Event Name:{eventname}</li>
        <li>Payload: {payload}</li>
        <li>Timestamp: {new Date(timestamp)}</li>
      </ul>
    </Content>
  </Panel>
</div>

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

  .event-value {
    font-size: small;
    color: midnightblue;
  }
</style>

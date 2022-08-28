<script>
  import ioClient from 'socket.io-client';
  //need to import the other component we wish to use
  import Event from './event.svelte';
  import Argument from './argument.svelte';

  let socket;
  //used to capture value of user server URL
  let connectTo = '';
  let eventname = '';
  let payload = '';
  let eventsIncoming = [];
  let eventsOutgoing = [];
  let payloadArgs = {};
  let argsCount = 0;
  let callbackTF = true;
  let cbParams = '';
  let cbBody = '';

  //creates a socket
  function connect() {
    //if there is an existing socket open, close it
    if (socket) {
      socket.close();
    }

    console.log(connectTo || 'http://localhost:3333/admin');
    //connects to
    //socket is the value of a socket IO connection to either the user's URL or  client
    socket = ioClient(connectTo || 'http://localhost:3333/admin', {
      //path: '/socket.io',
    });

    //timeout if the connection failed
    const connectionTimeout = setTimeout(() => {
      socket.close();
      socket = null;
      alert('fail');
    }, 3000);

    //if we have a socket already open, set listener for connect and clear the connection timeout
    if (socket) {
      socket.on('connect', () => {
        clearTimeout(connectionTimeout);
        alert('connected!');
        console.log('connected!');
        console.log('namespace is =>', socket.nsp);
      });
    }
    //this is how we seperate outgoing and incoming events
    socket.on('event_received', (...args) => {
      //args is an array : [socketID, ['event-name', payload], timestamp]
      const newEvent = args;
      console.log('event is =>', newEvent);
      //store each event within either incoming or outgoing array, but w/in array, we use another object to store info
      eventsIncoming = [...eventsIncoming, newEvent];
    });
    socket.on('event_sent', (...args) => {
      const newEvent = args;
      eventsOutgoing = [...eventsOutgoing, newEvent];
    });
  }

  function sendMessage() {
    console.log('hello');
    //if no event was sent, return out
    if (!eventname) return;
    // console.log('socket==>', socket);
    //have GUI emit the mock event with the payload

    const payloads = Object.values(payloadArgs).map((el) => {
      console.log(el);
      return JSON.parse(el.argValue);
    });

    console.log(payloads);

    if (callbackTF) {
      // create function
      const cb = new Function(cbParams, cbBody);
      // add to payloads
      payloads.push(cb);
    }

    socket.emit(eventname.trim(), ...payloads);
  }

  function removeEvent(e) {
    //each function has a direction property in order
    //sometimes timestamps would be the exact same so we have to check multiple properies
    if (e.detail.direction === 'outgoing') {
      eventsOutgoing = eventsOutgoing.filter((event) => {
        if (event[2] === e.detail.timestamp && event[0] === e.detail.socketId) {
          if (event[1][0] === e.detail.eventname) {
            return false;
          }
        }
        return true;
      });
    } else if (e.detail.direction === 'incoming') {
      eventsIncoming = eventsIncoming.filter((event) => {
        if (event[2] === e.detail.timestamp && event[0] === e.detail.socketId) {
          if (event[1][0] === e.detail.eventname) {
            return false;
          }
        }
        return true;
      });
    }
  }

  function addArg(e) {
    payloadArgs = {
      ...payloadArgs,
      [argsCount + 1]: {
        argKey: argsCount + 1,
        argValue: '',
        argType: '',
        argLabel: `arg${argsCount + 1}`,
      },
    };
    argsCount += 1;
  }

  function changeArg(e) {
    payloadArgs = {
      ...payloadArgs,
      [e.detail.argKey]: {
        argKey: e.detail.argKey,
        argValue: e.detail.argValue,
        argType: e.detail.argType,
        argLabel: e.detail.argLabel,
      },
    };
  }

  function removeArg(e) {
    console.log('removing an arg...');
    const tempObj = { ...payloadArgs };
    delete tempObj[e.detail.argKey];
    payloadArgs = { ...tempObj };
  }
</script>

<svelte:head>
  <title>GUI Client</title>
  <meta name="description" content="GUI dashboard" />
</svelte:head>

<section>
  <h1>GUI Interface</h1>
  <!-- bind:value - changes to the input value will update the connectTo value and changes to connectTo value will update input -->
  <input
    id="connect"
    autocomplete="on"
    type="url"
    bind:value={connectTo}
    placeholder="Server URL"
  />
  <button id="connect-btn" on:click={connect}>CLICK TO CONNECT</button>
  <form id="form" on:submit|preventDefault={sendMessage}>
    <input
      id="event"
      bind:value={eventname}
      placeholder="eventname"
      autocomplete="off"
    />
    <div id="argument-container">
      <!--  -->
      <!-- here we'll loop through our args and render them -->
      {#each Object.keys(payloadArgs) as argument}
        <Argument
          argLabel={payloadArgs[argument].argLabel}
          argType={payloadArgs[argument].argType}
          argValue={payloadArgs[argument].argValue}
          argKey={payloadArgs[argument].argKey}
          on:changeArg={changeArg}
          on:removeArg={removeArg}
        />
      {/each}
      <!-- button to add new arg row -->
      <button class="btn-newarg" type="button" on:click={addArg}
        >+ New Argument</button
      >
      {#if callbackTF}
        <div class="argument-row">
          <textarea
            class="cb-input"
            bind:value={cbParams}
            placeholder="Callback Params"
            autocomplete="off"
          />
          <textarea
            class="cb-input"
            bind:value={cbBody}
            placeholder="Callback Body"
            autocomplete="off"
          />
        </div>
      {/if}
    </div>
    <button type="submit">Send</button>
  </form>

  <div id="events">
    <div id="outgoing">
      {#if eventsOutgoing.length === 0}
        <p>No outgoing events</p>
      {:else}
        <p>Outgoing Events:</p>
        <!-- sveltes index loop -->
        <!-- creating a new li element containing the Event component -->
        <!-- setting a listener for the event name removeEvent - which will be dispatched from event component -->
        {#each eventsOutgoing as event}
          <li>
            <Event
              eventname={event[1][0]}
              payload={event[1].slice(1)}
              timestamp={event[2]}
              socketId={event[0]}
              direction="outgoing"
              on:removeEvent={removeEvent}
            />
          </li>
        {/each}
      {/if}
    </div>
    <div id="incoming">
      {#if eventsIncoming.length === 0}
        <p>No incoming events</p>
      {:else}
        <p>Incoming Events:</p>
        {#each eventsIncoming as event}
          <li>
            <Event
              eventname={event[1][0]}
              payload={event[1].slice(1)}
              timestamp={event[2]}
              socketId={event[0]}
              direction="incoming"
              on:removeEvent={removeEvent}
            />
          </li>
        {/each}
      {/if}
    </div>
  </div>
</section>

<style>
  body {
    margin: 0;
    padding-bottom: 3rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      Helvetica, Arial, sans-serif;
  }

  #form {
    padding: 0.25rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    backdrop-filter: blur(10px);
  }

  #input {
    border: none;
    padding: 0 1rem;
    flex-grow: 1;
    border-radius: 2rem;
    margin: 0.25rem;
  }

  #input:focus {
    outline: none;
  }

  #form > button {
    background: #333;
    border: none;
    padding: 0 1rem;
    margin: 0.25rem;
    border-radius: 3px;
    outline: none;
    color: #fff;
  }

  #events {
    display: grid;
    grid-template-columns: 5fr 0.3fr 5fr;
    grid-template-rows: auto;
    grid-template-areas: 'outgoing gap incoming';
  }

  #events > #outgoing {
    grid-area: outgoing;
    list-style-type: none;
    margin-top: 20px;
    font-size: medium;
  }

  #events > #outgoing > li {
    padding: 0.5rem 1rem;
    background: #fff;
  }

  #events > #outgoing > li:nth-child(odd) {
    background: #ccc;
  }

  #events > #incoming {
    grid-area: incoming;
    list-style-type: none;
    margin-top: 20px;
    font-size: medium;
  }

  #events > #incoming > li {
    padding: 0.5rem 1rem;
    background: #fff;
  }

  #events > #incoming > li:nth-child(odd) {
    background: #ccc;
  }
  .cb-input {
    width: 300px;
    height: 75px;
  }
  #argument-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .btn-newarg {
    align-self: center;
  }
</style>

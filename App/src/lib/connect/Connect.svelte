<script>
  import ioClient from 'socket.io-client';
  import { socketGlobal } from '../../stores';
  import { allEventsGlobal } from '../../stores';

  //used to capture value of user server URL
  let connectTo = '';

  // update state from store
  let allEvents;
  allEventsGlobal.subscribe((value) => {
    allEvents = value;
  });

  //creates a socket, updates store
  const connect = () => {
    connectTo = connectTo || 'http://localhost:3333/admin';
    console.log(connectTo);

    // if we don't have a socket in our state, create a new one
    let newSocket;
    newSocket = ioClient(connectTo, {});

    //timeout if the connection failed
    const connectionTimeout = setTimeout(() => {
      newSocket.close();
      newSocket = null;
      alert(`failed to connect to ${connectTo}`);
    }, 3000);

    //if we've successfully created a socket, clear the connection timeout and set listeners
    // if (newSocket) {
    newSocket.on('connect', () => {
      clearTimeout(connectionTimeout);
      console.log('namespace is =>', newSocket.nsp);
      //this is how we seperate outgoing and incoming events
      newSocket.on('event_received', (newEvent) => {
        //assigning incoming/outgoing property to render direction
        newEvent = { ...newEvent, direction: 'incoming' };
        allEventsGlobal.update((value) => {
          return [...value, newEvent];
        });
      });
      newSocket.on('event_sent', (newEvent) => {
        newEvent = { ...newEvent, direction: 'outgoing' };
        allEventsGlobal.update((value) => {
          return [...value, newEvent];
        });
      });

      // update store with new socket
      socketGlobal.update(() => newSocket);
      console.log('updated global socket');
    });
  };
  // };
</script>

<svelte:head>
  <title>GUI Welcome</title>
  <meta name="description" content="GUI welcome" />
</svelte:head>

<!-- CONNECT TO SERVER SECTION -->
<section>
  <h1>GUI Interface</h1>
  <div class="connect-container">
    <input
      id="connect"
      autocomplete="on"
      type="url"
      bind:value={connectTo}
      placeholder="Server URL"
    />
    <button id="connect-btn" on:click={connect}>CLICK TO CONNECT</button>
  </div>
</section>

<style>
  .connect-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>

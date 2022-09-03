<script>
  import ioClient from 'socket.io-client';
  import { socketGlobal } from '../../stores';
  import {
    allEventsGlobal,
    arrayOfEventNamesGlobal,
    arrayOfSocketIdsGlobal,
    arrayOfDirectionsGlobal,
    displayEventsGlobal,
    displayRulesGlobal,
    selectedEventNamesGlobal,
    selectedSocketIdsGlobal,
    selectedDirectionGlobal,
  } from '../../stores';

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
    function newEventDisplay(event) {
      if ($displayRulesGlobal[newEvent.eventName]) {
        displayEventsGlobal.update((value) => {
          return [...value, newEvent];
        });
      }
      if ($displayRulesGlobal[newEvent.socketId]) {
        displayEventsGlobal.update((value) => {
          return [...value, newEvent];
        });
      }
    }
    //if we've successfully created a socket, clear the connection timeout and set listeners
    // if (newSocket) {
    newSocket.on('connect', () => {
      clearTimeout(connectionTimeout);
      console.log('namespace is =>', newSocket.nsp);
      //this is how we seperate outgoing and incoming events
      newSocket.on('event_received', (newEvent) => {
        console.log('newEvent==>', newEvent);
        //assigning incoming/outgoing property to render direction
        newEvent = { ...newEvent, direction: 'incoming' };

        allEventsGlobal.update((value) => {
          return [...value, newEvent];
        });

        // if new event
        if (!$arrayOfEventNamesGlobal.includes(newEvent.eventName)) {
          console.log('making a change in the if does not include');

          $arrayOfEventNamesGlobal = Array.from([
            ...$arrayOfEventNamesGlobal,
            newEvent.eventName,
          ]);
          $selectedEventNamesGlobal = Array.from([
            ...$selectedEventNamesGlobal,
            newEvent.eventName,
          ]);
          $displayRulesGlobal[newEvent.eventName] = true;
        }

        // if new socketid
        if (!$arrayOfSocketIdsGlobal.includes(newEvent.socketId)) {
          console.log('making a change in the if does not include');

          $arrayOfSocketIdsGlobal = Array.from([
            ...$arrayOfSocketIdsGlobal,
            newEvent.socketId,
          ]);
          $selectedSocketIdsGlobal = Array.from([
            ...$selectedSocketIdsGlobal,
            newEvent.socketId,
          ]);
          $displayRulesGlobal[newEvent.socketId] = true;
        }

        // if new direction
        if (!$arrayOfDirectionsGlobal.includes(newEvent.direction)) {
          console.log('making a change in the if does not include');

          $arrayOfDirectionsGlobal = Array.from([
            ...$arrayOfDirectionsGlobal,
            newEvent.direction,
          ]);
          $selectedDirectionGlobal = Array.from([
            ...$selectedDirectionGlobal,
            newEvent.direction,
          ]);
          $displayRulesGlobal[newEvent.direction] = true;
        }

        displayEventsGlobal.update((value) => {
          return [...value, newEvent];
        });
      });

      newSocket.on('event_sent', (newEvent) => {
        newEvent = { ...newEvent, direction: 'outgoing' };
        allEventsGlobal.update((value) => {
          return [...value, newEvent];
        });

        // if new event
        if (!$arrayOfEventNamesGlobal.includes(newEvent.eventName)) {
          console.log('making a change in the if does not include');

          $arrayOfEventNamesGlobal = Array.from([
            ...$arrayOfEventNamesGlobal,
            newEvent.eventName,
          ]);
          $selectedEventNamesGlobal = Array.from([
            ...$selectedEventNamesGlobal,
            newEvent.eventName,
          ]);
          $displayRulesGlobal[newEvent.eventName] = true;
        }

        // if new socketid
        if (!$arrayOfSocketIdsGlobal.includes(newEvent.socketId)) {
          console.log('making a change in the if does not include');

          $arrayOfSocketIdsGlobal = Array.from([
            ...$arrayOfSocketIdsGlobal,
            newEvent.socketId,
          ]);
          $selectedSocketIdsGlobal = Array.from([
            ...$selectedSocketIdsGlobal,
            newEvent.socketId,
          ]);
          $displayRulesGlobal[newEvent.socketId] = true;
        }

        // if new direction
        if (!$arrayOfDirectionsGlobal.includes(newEvent.direction)) {
          console.log('making a change in the if does not include');

          $arrayOfDirectionsGlobal = Array.from(
            new Set([...$arrayOfDirectionsGlobal, newEvent.direction])
          );
          $selectedDirectionGlobal = Array.from(
            new Set([...$selectedDirectionGlobal, newEvent.direction])
          );
          $displayRulesGlobal[newEvent.direction] = true;
        }

        displayEventsGlobal.update((value) => {
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

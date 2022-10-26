<script lang="ts">
  import type { StoredEvent, EventArray } from '$lib/types';
  import ioClient from 'socket.io-client';
  import {
    eventLimitGlobal,
    socketGlobal,
    socketNspGlobal,
  } from '../../stores';
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
  let connectTo: string = '';

  // added because using eventlimit in funcs was reading static value when func was created, instead of updating
  const getStoreValue = (store: any) => {
    let $val;
    store.subscribe(($: any) => ($val = $))();
    return $val;
  };

  //only when we declare new things do we have to worry about type (function definitions, varibles used later down the line)
  allEventsGlobal.subscribe((value: EventArray) => {
    if (value.length) {
      // TS sometimes says "what if this is undefined, tho?"
      // const newestEvent: StoredEvent = value[value.length - 1];
      // ! mark tells typescript "this value will never be null/undefined"
      // OR, casting it with a type (as X) will do similarly, but coerces things so may not be best.
      // const newestEvent: StoredEvent = value[value.length - 1] as StoredEvent;

      //  new events are added to the front, so when we display on gui, the newest is at the top
      const newestEvent: StoredEvent = value[0]!;

      updateFn(newestEvent);
    }
  });

  //REFACTOR: using a set instead of an array for the global arrays and selectedArrays of directions, event-Names, and socketId => in stores
  function updateFn(newEvent: StoredEvent) {
    // if new event
    if (!$arrayOfEventNamesGlobal.includes(newEvent.eventName)) {
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
    //REFACTOR: need to add a check to see which filters are currently toggled to determine whether incoming event or not to add to the current display arr.
    displayEventsGlobal.update((value: EventArray): EventArray => {
      //when we update display make sure it's in line with eventLimit
      const eventLimit = getStoreValue(eventLimitGlobal)!;
      if (value.length + 1 > eventLimit)
        return [newEvent, ...value].slice(0, eventLimit);
      return [newEvent, ...value];
    });
  }

  //creates a socket, updates store
  const connect = () => {
    connectTo = connectTo || 'http://localhost:3333/admin';
    console.log(connectTo);

    // if we don't have a socket in our state, create a new one
    let newSocket: any; // typed as "any" here because .nsp is private, can't figure out how to access it
    newSocket = ioClient(connectTo, {});

    //timeout if the connection failed
    const connectionTimeout = setTimeout(() => {
      newSocket.close();
      // newSocket = null; // no need to assign null here, we've already closed it
      alert(`failed to connect to ${connectTo}`);
    }, 3000);

    //if we've successfully created a socket, clear the connection timeout, set listeners, and save namespace name
    newSocket.on('connect', (): void => {
      socketNspGlobal.set(newSocket.nsp);
      clearTimeout(connectionTimeout);
      console.log('namespace is =>', newSocket.nsp);

      //this is how we separate outgoing and incoming events
      newSocket.on('event_received', (newEvent: StoredEvent) => {
        console.log('received!!!!!!!!', newEvent);
        allEventsGlobal.update((value: EventArray): EventArray => {
          //when we update allEvents make sure it's in line with eventLimit
          const eventLimit = getStoreValue(eventLimitGlobal)!;
          if (value.length + 1 > eventLimit)
            return [newEvent, ...value].slice(0, eventLimit);
          return [newEvent, ...value];
        });
      });

      newSocket.on('event_sent', (newEvent: StoredEvent) => {
        console.log('sent!!!!!!!!', newEvent);
        //if we don't provide a type, ts is going to give this a type of never
        allEventsGlobal.update((value: EventArray): EventArray => {
          //when we update allEvents make sure it's in line with eventLimit
          const eventLimit = getStoreValue(eventLimitGlobal)!;
          if (value.length + 1 > eventLimit)
            return [newEvent, ...value].slice(0, eventLimit);
          return [newEvent, ...value];
        });
      });

      // update store with new socket
      socketGlobal.update(() => newSocket);
      console.log('updated global socket');
    });
  };
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
    <!-- typing connect function is tricky since on click types expect event handlers, not just a function, which we would define connect as -->
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

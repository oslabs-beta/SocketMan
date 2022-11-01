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
    displayEventsGlobal,
    masterFilterGlobal,
    masterOptionsGlobal,
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

  function updateFn(newEvent: StoredEvent) {
    masterFilterGlobal.update((value) => {
      const newObj: any = {};
      // loop through all attributes
      for (let attribute in $masterOptionsGlobal) {
        // if attribute set in masterOptionsGlobal does not contain new event's attribute,
        // then we add it to our applied filters object in the correct attribute set

        // if dealing with rooms attribute, we're looking at an array that we need to check inside of
        if (attribute === 'rooms') {
          // loop through rooms. if we have any of the event rooms in our filter, we're good. else return false
          for (let room of newEvent.rooms) {
            if (!$masterOptionsGlobal[attribute].has(newObj[room])) {
              // update newobj (applied filters)
              newObj[attribute] = new Set([
                ...value[attribute],
                ...newEvent[attribute],
              ]);
            }
          }
          // if any attribute other than rooms, if the string does not exist in applied filters, retrun false
        } else if (!$masterOptionsGlobal[attribute].has(newObj[attribute])) {
          // update newobj (applied filters)
          newObj[attribute] = new Set([
            ...value[attribute].add(newEvent[attribute]),
          ]);
        }
      }
      // return our temp object as new masterfilters value
      return newObj;
    });

    masterOptionsGlobal.update((value) => {
      const newObj: any = {};
      for (let attribute in value) {
        if (attribute === 'rooms') {
          // loop through rooms. if we have any of the event rooms in our filter, we're good. else return false
          for (let room of newEvent.rooms) {
            newObj[attribute] = new Set([...value[attribute].add(room)]);
          }
          // if any attribute other than rooms, if the string does not exist in applied filters, retrun false
        } else {
          newObj[attribute] = new Set([
            ...value[attribute].add(newEvent[attribute]),
          ]);
        }
      }
      return newObj;
    });

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
  <video src="../static/sky.mp4">
    <track kind="captions" />
  </video>
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

<script lang="ts">
  import type { StoredEvent, EventArray } from '$lib/types';
  import Fab, { Icon, Label } from '@smui/fab';
  import ioClient from 'socket.io-client';

  import {
    allEventsGlobal,
    displayEventsGlobal,
    masterFilterGlobal,
    masterOptionsGlobal,
    eventLimitGlobal,
    socketGlobal,
    socketNspGlobal,
  } from '../../stores';

  //used to capture value of user server URL
  let connectTo: string = '';
  let requestedNsp: string = '';
  let username: string = '';
  let password: string = '';

  // added because using eventlimit in funcs was reading static value when func was created, instead of updating
  const getStoreValue = (store: any) => {
    let $val;
    store.subscribe(($: any) => ($val = $))();
    return $val;
  };

  //only when we declare new things do we have to worry about type (function definitions, varibles used later down the line)
  allEventsGlobal.subscribe((value: EventArray) => {
    if (value.length) {
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
    requestedNsp = requestedNsp || 'admin';
    let auth: any = false;
    if (username && password) {
      auth = { username, password };
    }
    // if we don't have a socket in our state, create a new one
    let newSocket: any; // typed as "any" here because .nsp is private, can't figure out how to access it
    newSocket = ioClient(connectTo + '/' + requestedNsp, {
      auth,
    });
    //timeout if the connection failed
    const connectionTimeout = setTimeout(() => {
      newSocket.close();
      alert(`failed to connect to ${connectTo}`);
    }, 3000);

    //if we've successfully created a socket, clear the connection timeout, set listeners, and save namespace name
    newSocket.on('connect', (): void => {
      socketNspGlobal.set(newSocket.nsp);
      clearTimeout(connectionTimeout);

      //this is how we separate outgoing and incoming events
      newSocket.on('event_received', (newEvent: StoredEvent) => {
        allEventsGlobal.update((value: EventArray): EventArray => {
          //when we update allEvents make sure it's in line with eventLimit
          const eventLimit = getStoreValue(eventLimitGlobal)!;
          if (value.length + 1 > eventLimit)
            return [newEvent, ...value].slice(0, eventLimit);
          return [newEvent, ...value];
        });
      });

      newSocket.on('error', function (err: any) {
        console.log('err===>', err);
      });

      newSocket.on('event_sent', (newEvent: StoredEvent) => {
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
    });
  };
</script>

<svelte:head>
  <title>Socketman</title>
  <meta name="description" content="Socketman" />
</svelte:head>

<!-- CONNECT TO SERVER SECTION -->
<section class="wrapper">
  <div class="video-wrapper">
    <video src="../static/strings.mp4" playsinline autoplay muted loop>
      <track kind="captions" />
    </video>
  </div>
  <div class="overlay" />
  <div class="landing-content">
    <h1>SocketMan</h1>
    <input
      class="main-input"
      id="connect"
      autocomplete="on"
      type="url"
      bind:value={connectTo}
      placeholder="Server URL"
    />
    <input
      class="secondary-input"
      id="requestednsp"
      autocomplete="on"
      type="input"
      bind:value={requestedNsp}
      placeholder="Namespace"
    />
    <input
      class="secondary-input"
      id="username"
      autocomplete="on"
      type="username"
      bind:value={username}
      placeholder="username"
    />
    <input
      class="secondary-input"
      id="password"
      autocomplete="on"
      type="password"
      bind:value={password}
      placeholder="Password"
    />
    <Fab color="primary" on:click={connect} extended>
      <Icon class="material-icons">rocket</Icon>
      <Label>CLICK TO CONNECT</Label>
    </Fab>
  </div>
</section>

<style>
  section {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    margin: auto;
    text-align: center;
    font-family: 'Orbitron', sans-serif;
  }
  .wrapper {
    height: 100vh;
    display: flex;
    align-items: top;
    justify-content: center;
    color: #fff;
  }

  .video-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }

  .video-wrapper video {
    min-width: 100%;
    min-height: 100%;
  }

  .overlay {
    z-index: 1;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background: #2d3e50;
    position: absolute;
    opacity: 0.7;
  }

  .landing-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 25vh;
    z-index: 2;
  }

  h1 {
    font-size: 500%;
    margin-bottom: 30px;
    color: whitesmoke;
  }
  input::placeholder {
    color: rgb(172, 172, 172);
  }
  input {
    font-size: 120%;
    font-weight: 400;
    padding: 20px 0px 20px 5px;
    padding-left: 10px;
    width: 20vw;
    background-color: rgba(0, 0, 0, 0.3);
    color: whitesmoke;
  }
  .main-input {
    margin: 15px 0px;
  }
  .secondary-input {
    margin-bottom: 5px;
    padding-top: 7px;
    padding-bottom: 7px;
  }
</style>

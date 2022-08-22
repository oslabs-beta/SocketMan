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
	  height: 3rem;
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
	  grid-template-areas: 
      'outgoing gap incoming'; 
	}

	#events > #outgoing {
	  grid-area: outgoing;
	  list-style-type: none;
	  margin-top: 20px;
	  font-size: medium;
	}

	#events > #outgoing > li {
	  padding: 0.5rem 1rem;
	  background: #FFF
	}

	#events >#outgoing > li:nth-child(odd) {
	  background: #CCC;
	}

	#events > #incoming {
	  grid-area: incoming;
	  list-style-type: none;
	  margin-top: 20px;
	  font-size: medium;
	}

	#events > #incoming > li {
	  padding: 0.5rem 1rem;
	  background: #FFF
	}

	#events >#incoming > li:nth-child(odd) {
	  background: #CCC;
	}
</style>

<script >
    import ioClient from 'socket.io-client';
	import Event from './event.svelte';
 
    let socket;
    let connectTo = ''; 
    let eventname = '';
    let payload = '';
    let eventsIncoming = [];
	let eventsOutgoing = [];
	
    function connect() {	
      if(socket){
      socket.close()}
        
        console.log(connectTo || 'http://localhost:3333/admin');
        socket = ioClient(connectTo || 'http://localhost:3333/admin', {
          //path: '/socket.io',
        });
       
        const connectionTimeout = setTimeout(() => {
          socket.close();
          socket = null;
          alert('fail');
        }, 3000);


        if (socket){
         socket.on('connect', () => {
         clearTimeout(connectionTimeout);
         alert('connected!');
         console.log('connected!')
         console.log('namespace is =>', socket.nsp);    
        })}

        socket.on('event_received', (...args) => {
			 const newEvent = args
			 eventsIncoming = [...eventsIncoming, newEvent]
          });
          socket.on('event_sent', (...args) => {
			const newEvent = args
			eventsOutgoing = [...eventsOutgoing, newEvent]
          });
    }

    function sendMessage() {
      if(!eventname) return;
	  console.log("socket==>", socket)
	  socket.emit(eventname.trim(), payload);
      eventname='';
      payload = '';
    }

	function removeEvent(e) {
	  if (e.detail.direction === 'outgoing'){
          eventsOutgoing = eventsOutgoing.filter(event => {if (event[2] === e.detail.timestamp && event[0] === e.detail.socketId){
	  if (event[1][0] === e.detail.eventname) {
			return false}	
		}
		return true;
	    })
	    }else if (e.detail.direction === 'incoming'){
			eventsIncoming = eventsIncoming.filter(event => {if (event[2] === e.detail.timestamp && event[0] === e.detail.socketId){
		if (event[1][0] === e.detail.eventname) {
			return false}	
		}
		return true;
	})
		}
	}
</script>


<svelte:head>
	<title>GUI Client</title>
	<meta name='description' content='GUI dashboard' />
</svelte:head>

  <section>
    <h1>GUI Interface</h1>
  <input id='connect' autocomplete='on' type='url' bind:value={connectTo} placeholder='Server URL' />
  <button id='connect-btn' on:click={connect}>CLICK TO CONNECT</button>
  <form id='form' action='#' on:submit|preventDefault={sendMessage}>
    <input id='event' bind:value={eventname} placeholder='eventname' autocomplete='off' />
    <input id='payload' bind:value={payload} placeholder='payload' autocomplete='off' />
    <button>Send</button>
  </form>
  
  <div id='events'>
	<div id='outgoing'>
	{#if eventsOutgoing.length === 0}
    <p>No outgoing events</p>
  {:else}
  <p>Outgoing Events:</p>
    {#each eventsOutgoing as event}
	<li>
      <Event
        eventname={event[1][0]}
        payload={event[1].slice(1)}
		timestamp={event[2]}
		socketId = {event[0]}
		direction = 'outgoing'
        on:removeEvent={removeEvent} />
	</li>
    {/each}
  {/if}
  </div>
  <div id='incoming'>
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
		socketId = {event[0]}
		direction = 'incoming'
        on:removeEvent={removeEvent} />
	</li>
    {/each}
  {/if}
  </div>
</div>
</section>


	
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
	  grid-template-columns: 1fr;
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
	  background: #CCC;
	}

	#events >#outgoing > li:nth-child(odd) {
	  background: #FFF
	}
/* 
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
	} */
</style>

<script >
    import ioClient from 'socket.io-client';
	//need to import the other component we wish to use
	import Event from './event.svelte';
	
    let socket;
	//used to capture value of user server URL
    let connectTo = ''; 
    let eventname = '';
    let payload = '';
	//primary arr to be displayed
	let allEvents = [];
	//let filtered be assigned val of allEvents at first, will be reassigned based on filter
	let filteredEvents = [];
	let filteredSocketID;
	let iterable;
	//creates a socket 
    function connect() {
	//if there is an existing socket open, close it	
      if(socket){
      socket.close()}
        
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
        if (socket){
         socket.on('connect', () => {
         clearTimeout(connectionTimeout);
         alert('connected!');
         console.log('connected!')
         console.log('namespace is =>', socket.nsp);    
        })}
	//this is how we seperate outgoing and incoming events
        socket.on('event_received', (newEvent) => {
			//assigning incoming/outgoing property to render direction 
			console.log('event =>', newEvent);
			newEvent = {...newEvent, direction: 'incoming'}
			allEvents = [...allEvents, newEvent]
			console.log('filtered events is =>', filteredEvents);
          });
          socket.on('event_sent', (newEvent) => {
			newEvent = {...newEvent, direction: 'outgoing'}
			allEvents = [...allEvents, newEvent]
          });
    }
	//filter functionality for different views (event based, and socketID)
		//each function reassigns filteredEvents arr based on user's desired setting
	//maybe want to explore sorting by time incoming, alphabetical (for event name)
	function filterEventName(eventName) {
		//event is an obj now
		filteredEvents = allEvents.filter(event => event.eventName === eventName);
		console.log('filtered =>', filteredEvents);
	}
	function filterSocketID(socketid) {
		filteredEvents = allEvents.filter(event => event.socketID === socketid);
		console.log('filter =>', filteredEvents);
	}



    function sendMessage() {
	//if no event was sent, return out
      if(!eventname) return;
	  console.log("socket==>", socket)
	//have GUI emit the mock event with the payload
	  socket.emit(eventname.trim(), payload);
	//reassign event name and payload to empty strings
      eventname='';
      payload = '';
    }

	function removeEvent(e) {
		//each function has a direction property in order 
		//sometimes timestamps would be the exact same so we have to check multiple properies 
		filter('test-event', eventsIncoming);
	
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
	<!-- bind:value - changes to the input value will update the connectTo value and changes to connectTo value will update input -->
	<input id='connect' autocomplete='on' type='url' bind:value={connectTo} placeholder='Server URL' />
	<button id='connect-btn' on:click={connect}>CLICK TO CONNECT</button>
	<form id='form' action='#' on:submit|preventDefault={sendMessage}>
		<input id='event' bind:value={eventname} placeholder='eventname' autocomplete='off' />
		<input id='payload' bind:value={payload} placeholder='payload' autocomplete='off' />
		<button>Send</button>
	</form>
	<button id ='test' on:click={() => {filterEventName('change-color')}}>CLICK TO FILTER</button>
	<button id ='test' on:click={() => {filterSocketID('r1YxjnWZ8cq_VDXKAAAD')}}>CLICK TO FILTER ID</button>

	<div id='events'>
		<!-- {#if allEvents.length === 0} -->
		<!-- <p>No events</p>
		{:else}
		<p>Events:</p>
		{#if filteredEvents.length < allEvents.length}
			{iterable = filteredEvents};
		 {:else} -->
			<!-- {iterable = allEvents}; -->
		 {#each filteredEvents.length < allEvents.length ? filteredEvents : allEvents as event}
			<li>
				<Event
				eventname={event.eventName}
				payload={event.payload}
				timestamp={event.date}
				socketId = {event.socketId}
				direction = {event.direction}
				on:removeEvent={removeEvent} />
			</li>
		{/each}
		<!-- {/if} -->
		<!-- sveltes index loop -->
		<!-- creating a new li element containing the Event component -->
		<!-- setting a listener for the event name removeEvent - which will be dispatched from event component -->

		<!-- {/if} -->
	</div>
</section>


	
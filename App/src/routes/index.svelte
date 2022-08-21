<!-- <script context="module">
	export const prerender = true;
</script> -->



<!-- let messages = [];

	onMount(() => {
		io.on('message', (message) => {
			// Listen to the message event
			messages = [...messages, message];
		});
		io.on('name', (name) => {
			// Another listener for the name:
			username = name; // Update the name so it can be displayed
		});
	});

	function sendMessage() {
		const message = textfield.trim();
		if (!message) return;

		textfield = '';
		io.emit('message', message); // Send the message
	}
</script>

<div class="h-screen w-screen bg-zinc-800">
	<div class="h-full w-full max-w-md mx-auto bg-zinc-500 flex flex-col">
		<header
			class="px-6 py-4 border-b border-zinc-800 bg-zinc-700 text-white shrink-0 flex items-center justify-between"
		>
			<span class="font-bold text-xl">My Chat app</span>
			<span>{username}</span>
		</header>

		<div class="h-full w-full p-4">
			{#each messages as message}
				<div class="bg-zinc-300 rounded-xl rounded-tl-none px-4 py-3 my-4 w-fit">
					<span class="flex items-center space-between gap-4">
						<b>{message.from}</b>
						<i>{message.time}</i>
					</span>
					{message.message}
				</div>
			{/each}
		</div> -->



           <!-- this would be a listener that was added manually
          socket.on('receive message', function (msg) {
            // for (key in socket) console.log(key, ': ', socket[key]);
            var item = document.createElement('li');
            item.textContent = `${new Date().toLocaleString()} --- ${
              socket.id
            } ---${socket.id} --- ${JSON.stringify(msg)}`;
            messages.appendChild(item);
            window.scrollTo(0, document.body.scrollHeight);
          });
        });
      }); -->

     

<svelte:head>
	<title>GUI Client</title>
	<meta name="description" content="GUI dashboard" />
</svelte:head>

 

	<style>
		body {
		  margin: 0;
		  padding-bottom: 3rem;
		  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
			Helvetica, Arial, sans-serif;
		}
  
		#form {
		  background: rgba(0, 0, 0, 0.15);
		  padding: 0.25rem;
		  position: fixed;
		  /* bottom: 0;
		  left: 0;
		  right: 0; */
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
  
		#messages {
		  list-style-type: none;
		  margin: 0;
		  padding: 0;
		}
		#messages > li {
		  padding: 0.5rem 1rem;
		}
		#messages > li:nth-child(odd) {
		  background: #efefef;
		}
	  </style>


<script >
    //import { io } from "../lib/realtime";
    import { onMount, afterUpdate } from "svelte";
    import ioClient from 'socket.io-client';


//const socket = ioClient(ENDPOINT);
 
    let socket;
    let connectTo = ''; 


    let eventname = ""
    let payload = ""

    let messages = []

    
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
            console.log(args);
          });
          socket.on('event_sent', (...args) => {
            console.log(args);
          });
     
    }

    

    function sendMessage() {
      if(!eventname) return;
    socket.emit(eventname.trim(), payload);
          eventname='';
          payload = '';
        }
      
</script>



  <section>
    <h1>GUI Interface</h1>
  <ul id="messages"></ul>
  
  <input id="connect" autocomplete="on" type="url" bind:value={connectTo} placeholder="Server URL" />
  <button id="connect-btn" on:click={connect}>CLICK TO CONNECT</button>
  <form id="form" action="#" on:submit|preventDefault={sendMessage}>
    <input id="event" bind:value={eventname} placeholder="eventname" autocomplete="off" />
    <input id="payload" bind:value={payload} placeholder="payload" autocomplete="off" />
    <button>Send</button>
  </form>
    </section>
   
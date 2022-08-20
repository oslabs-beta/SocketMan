<!-- <script context="module">
	export const prerender = true;
</script> -->



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
        
        console.log(connectTo || 'http://localhost:3333');
        socket = ioClient(connectTo || 'http://localhost:3333', {
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
         
   })}
     
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
   
<script context="module">
	export const prerender = true;
</script>

<!-- <script src="/socket.io/socket.io.js"></script> -->

<script>
      var socket = io();

      var messages = document.getElementById('messages');
      var form = document.getElementById('form');
      var connect = document.getElementById('connect');
      var eventType = document.getElementById('event');
      var payload = document.getElementById('payload');

      var connectBtn = document.getElementById('connect-btn');
      connectBtn.addEventListener('click', () => {
        socket.close();
        const connectTo = connect.value;
        console.log(connectTo || 'http://localhost:3333');
        socket = io(connectTo || 'http://localhost:3333', {
          path: '/socket.io',
        });

        connectionTimeout = setTimeout(() => {
          socket.close();
          socket = null;
          alert('fail');
        }, 3000);

        socket.on('connect', () => {
          clearTimeout(connectionTimeout);
          alert('connected!');

          // this would be a listener that was added manually
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
      });

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        console.log(io);
        console.log({ payload: payload.value, eventType: eventType.value });
        if (eventType.value) {
          socket.emit(eventType.value, payload.value);
          payload.value = '';
        }
      });
    </script>

<svelte:head>
	<title>GUI Client</title>
	<meta name="description" content="GUI dashboard" />
</svelte:head>

<body>
    <h1>GUI Interface</h1>
    <ul id="messages"></ul>
    <input id="connect" type="url" autocomplete="on" />
    <button id="connect-btn">CLICK TO CONNECT</button>
    <form id="form" action="">
      <input id="event" autocomplete="off" />
      <input id="payload" autocomplete="off" />
      <button>Send</button>
    </form>
	</body>

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
<script>
  import ioClient from 'socket.io-client';
  import { bind } from 'svelte/internal';
  import { socketGlobal } from '../../stores';
  import { allEventsGlobal } from '../../stores';

  import hljs from 'highlight.js/lib/core';
  import javascript from 'highlight.js/lib/languages/javascript';
  hljs.registerLanguage('javascript', javascript);
  // console.log(hljs);
  // console.log(hljs.listLanguages());

  class Cursor {
    static getCurrentCursorPosition(parentElement) {
      var selection = window.getSelection(),
        charCount = -1,
        node;

      if (selection.focusNode) {
        if (Cursor._isChildOf(selection.focusNode, parentElement)) {
          node = selection.focusNode;
          charCount = selection.focusOffset;

          while (node) {
            if (node === parentElement) {
              break;
            }

            if (node.previousSibling) {
              node = node.previousSibling;
              charCount += node.textContent.length;
            } else {
              node = node.parentNode;
              if (node === null) {
                break;
              }
            }
          }
        }
      }

      return charCount;
    }

    static setCurrentCursorPosition(chars, element) {
      if (chars >= 0) {
        var selection = window.getSelection();

        let range = Cursor._createRange(element, { count: chars });

        if (range) {
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    }

    static _createRange(node, chars, range) {
      if (!range) {
        range = document.createRange();
        range.selectNode(node);
        range.setStart(node, 0);
      }

      if (chars.count === 0) {
        range.setEnd(node, chars.count);
      } else if (node && chars.count > 0) {
        if (node.nodeType === Node.TEXT_NODE) {
          if (node.textContent.length < chars.count) {
            chars.count -= node.textContent.length;
          } else {
            range.setEnd(node, chars.count);
            chars.count = 0;
          }
        } else {
          for (var lp = 0; lp < node.childNodes.length; lp++) {
            range = Cursor._createRange(node.childNodes[lp], chars, range);

            if (chars.count === 0) {
              break;
            }
          }
        }
      }

      return range;
    }

    static _isChildOf(node, parentElement) {
      while (node !== null) {
        if (node === parentElement) {
          return true;
        }
        node = node.parentNode;
      }

      return false;
    }
  }

  const updateFormat = (e) => {
    // reformat
    const oldPos = Cursor.getCurrentCursorPosition(e.target);
    hljs.highlightElement(e.target);
    Cursor.setCurrentCursorPosition(oldPos, e.target);

    // update state
  };

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
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/styles/dark.min.css"
  />
</svelte:head>

<!-- CONNECT TO SERVER SECTION -->
<section>
  <div
    class="texty language-javascript javascript"
    spellcheck="false"
    contenteditable="true"
    on:input={updateFormat}
  />
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
  .texty {
    display: inline-block;
    min-width: 50px;
    width: 100%;
    min-height: 50px;
  }
  .connect-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>

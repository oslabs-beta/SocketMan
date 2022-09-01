<script>
  import {
    argsCountGlobal,
    callbackTFGlobal,
    cbBodyGlobal,
    cbParamsGlobal,
    eventNameGlobal,
    payloadArgsGlobal,
    socketGlobal,
    allEventsGlobal,
  } from '../../stores';

  import Argument from './argument.svelte';

  function sendMessage() {
    //if no event was sent, return out
    if (!$eventNameGlobal) return;

    // init exitflag and error message in case values are invalid
    let exitFlag = false;
    let errMsg = null;

    // create payloads array using argument strings parsed by json
    const payloads = Object.values($payloadArgsGlobal).map((el) => {
      if (!exitFlag) {
        return el.argType === 'undefined' ? undefined : JSON.parse(el.argValue);
      }
    });

    // if there's a callback function provided, create it
    let cb = null;
    if (!exitFlag && $callbackTFGlobal) {
      try {
        // create function
        cb = new Function($cbParamsGlobal, $cbBodyGlobal);
        // add callback to payloads
        payloads.push(cb);
      } catch (error) {
        exitFlag = true;
        if (!errMsg)
          errMsg = `
          Could not compile function :(`;
      }
    }
    if (exitFlag) {
      alert(errMsg);
      return;
    }

    // emit the event using the established socket in stores
    $socketGlobal.emit($eventNameGlobal.trim(), ...payloads);

    // create the event object
    const eventObject = {
      socketId: $socketGlobal.id,
      eventName: $eventNameGlobal,
      payload: payloads,
      cb: cb || null,
      date: new Date(),
      direction: 'Socketman',
    };

    allEventsGlobal.update((value) => {
      return [...value, eventObject];
    });

    // temporary confirmation of success
    alert('Event emitted successfully!');
  }

  function addArg(e) {
    // update payload obj by cloning it and adding a new default entry
    // increment the key to keep everything unique and searchable
    payloadArgsGlobal.update(() => {
      return {
        ...$payloadArgsGlobal,
        [$argsCountGlobal + 1]: {
          argKey: $argsCountGlobal + 1,
          argValue: '',
          argType: '',
          argLabel: `arg${$argsCountGlobal + 1}`,
          validJson: false,
        },
      };
    });
    argsCountGlobal.update(() => $argsCountGlobal + 1);
  }

  function changeArg(e) {
    // update payload obj by cloning it and updating a given key with a new object
    payloadArgsGlobal.update(() => {
      return {
        ...$payloadArgsGlobal,
        [e.detail.argKey]: {
          argKey: e.detail.argKey,
          argValue: e.detail.argValue,
          argType: e.detail.argType,
          argLabel: e.detail.argLabel,
          validJson: e.detail.validJson,
        },
      };
    });
  }

  function removeArg(e) {
    // update payload obj by cloning it and deleting the requested key
    const tempObj = { ...$payloadArgsGlobal };
    delete tempObj[e.detail.argKey];
    payloadArgsGlobal.update(() => {
      return { ...tempObj };
    });
  }

  function clearAllArgs(e) {
    // update payload obj by replacing it with a blank object
    payloadArgsGlobal.update(() => {
      return {};
    });
    // hide the callback too
    callbackTFGlobal.update(() => false);
  }
</script>

<svelte:head>
  <title>Socketman</title>
  <meta name="description" content="GUI socketman" />
</svelte:head>

<section>
  <h1>Socketman Interface</h1>

  <h3 id="emit-preview">
    {`socket.emit(${$eventNameGlobal}${
      Object.keys($payloadArgsGlobal).length ? ', ' : ''
    }${Object.values($payloadArgsGlobal)
      .map((el) => el.argLabel)
      .join(', ')}${$callbackTFGlobal ? ', callback' : ''})`}
  </h3>

  <!-- SOCKETMAN SECTION -->
  <form id="socketman" on:submit|preventDefault={sendMessage}>
    <div id="socketman-top">
      <input
        id="event"
        bind:value={$eventNameGlobal}
        placeholder="eventName"
        autocomplete="off"
      />
      {#if Object.keys($payloadArgsGlobal).length}
        <button id="clear-args" type="button" on:click={clearAllArgs}
          >Remove all arguments</button
        >
      {/if}
    </div>

    <div id="argument-container">
      <!--  -->
      <!-- here we'll loop through our args and render them -->
      {#each Object.values($payloadArgsGlobal) as argument}
        <Argument
          argLabel={argument.argLabel}
          argType={argument.argType}
          argValue={argument.argValue}
          argKey={argument.argKey}
          validJson={argument.validJson}
          on:changeArg={changeArg}
          on:removeArg={removeArg}
        />
      {/each}
      <div id="socketman-mid">
        <!-- button to add new arg row -->
        <button class="btn-newarg" type="button" on:click={addArg}
          >+ New Argument</button
        >
        <div id="cb-toggle-container">
          <label for="cb-checkbox">Toggle Acknowledgement (Callback)</label>
          <input
            id="cb-checkbox"
            type="checkbox"
            bind:checked={$callbackTFGlobal}
          />
        </div>
      </div>
      {#if $callbackTFGlobal}
        <div class="cb-container">
          <textarea
            class="cb-params"
            bind:value={$cbParamsGlobal}
            placeholder="Callback Params"
            autocomplete="off"
          />
          <textarea
            class="cb-body"
            bind:value={$cbBodyGlobal}
            placeholder="Callback Body"
            autocomplete="off"
          />
        </div>
      {/if}
    </div>

    {#if Object.values($payloadArgsGlobal).reduce((sum, cur) => {
      return cur.validJson ? 0 : sum + 1;
    }, 0)}
      <button id="emit-btn" class="disabled" type="button">Can't emit :(</button
      >
    {:else}
      <button id="emit-btn" type="submit">Emit</button>
    {/if}
  </form>
  <!-- bind:value - changes to the input value will update the connectTo value and changes to connectTo value will update input -->
</section>

<style>
  #socketman {
    padding: 0.25rem;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    backdrop-filter: blur(10px);
  }
  #socketman > button {
    align-self: center;
    background: rgb(63, 153, 108);
    width: 50%;
    border: none;
    padding: 7px;
    margin: 20px 0;
    border-radius: 3px;
    outline: none;
    color: #fff;
  }
  #argument-container {
    /* width: 100%; */
    display: flex;
    flex-direction: column;
    /* align-items: center; */
  }
  #socketman-mid {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  #cb-toggle-container {
    display: flex;
    justify-content: center;
  }
  .cb-container {
    display: flex;
  }
  .cb-params {
    width: 30%;
  }
  .cb-body {
    width: 70%;
  }
  .btn-newarg {
    align-self: center;
  }
  #socketman-top {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  #socketman-top > #event {
    justify-self: flex-start;
  }
  #emit-btn {
    background-color: green;
  }
  .disabled {
    background-color: gray !important;
  }
  #emit-preview {
    font-family: monospace;
    color: rgb(255, 255, 255);
    background-color: black;
    padding: 5px;
    font-weight: 400;
  }
</style>

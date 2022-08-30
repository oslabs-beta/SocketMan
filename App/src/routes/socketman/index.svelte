<script>
  import {
    argsCountGlobal,
    callbackTFGlobal,
    cbBodyGlobal,
    cbParamsGlobal,
    eventNameGlobal,
    payloadArgsGlobal,
    socketGlobal,
  } from '../../stores';

  import Argument from './argument.svelte';

  function sendMessage() {
    //if no event was sent, return out
    if (!$eventNameGlobal) return;

    // create payloads array using argument strings parsed by json
    const payloads = Object.values($payloadArgsGlobal).map((el) => {
      console.log(el);
      return JSON.parse(el.argValue);
    });

    // if there's a callback function provided, create it
    if ($callbackTFGlobal) {
      // create function

      // should probably add a try/catch here in case it's bad input
      const cb = new Function($cbParamsGlobal, $cbBodyGlobal);

      // add callback to payloads
      payloads.push(cb);
    }

    // emit the event using the established socket in stores
    $socketGlobal.emit($eventNameGlobal.trim(), ...payloads);
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
      {#each Object.keys($payloadArgsGlobal) as argument}
        <Argument
          argLabel={$payloadArgsGlobal[argument].argLabel}
          argType={$payloadArgsGlobal[argument].argType}
          argValue={$payloadArgsGlobal[argument].argValue}
          argKey={$payloadArgsGlobal[argument].argKey}
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

    <button id="emit-btn" type="submit">Emit</button>
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
</style>

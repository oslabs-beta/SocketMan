<script lang="ts">
  import type {
    EventArray,
    savedEventBody,
    savedEventsObj,
    StoredEvent,
  } from '$lib/types';
  import {
    argsCountGlobal,
    callbackTFGlobal,
    cbBodyGlobal,
    cbParamsGlobal,
    eventNameGlobal,
    payloadArgsGlobal,
    socketGlobal,
    allEventsGlobal,
    socketNspGlobal,
  } from '../../stores';

  import Argument from './argument.svelte';
  import SaveList from './saveList.svelte';
  import { resetSocketmanStore } from '../../lib/functions/restSocketmanStore';

  let savedEventName: string = '';
  let selectedEvent: string = '';
  // check localstorage on mount
  let savedEvents: string | undefined = window.localStorage.savedEvents;
  // initialize if savedEvents doesn't exist
  if (!savedEvents) {
    window.localStorage.savedEvents = JSON.stringify({});
  }

  // save savedEvents to state
  // set new variable for parsing the json
  const savedEventsObj: savedEventsObj = JSON.parse(
    window.localStorage.savedEvents
  );

  function saveEvent(): void {
    if (savedEventName === '') return;
    // add to savedEvents object a new object of all our inputs
    savedEventsObj[savedEventName] = {
      callbackTF: $callbackTFGlobal,
      cbBody: $cbBodyGlobal,
      cbParams: $cbParamsGlobal,
      eventName: $eventNameGlobal,
      payloadArgs: $payloadArgsGlobal,
    };
    // then stringify the entire savedevents object and update localstorage with it
    window.localStorage.savedEvents = JSON.stringify(savedEvents);
  }

  function loadEvent(e: { target: HTMLSelectElement }): void {
    // update selectedEvent state
    selectedEvent = e.target.value;
    // if we chose the blank option, clear the form
    if (selectedEvent === '') return reset();

    // else, update all globals to update all form values
    const choice: savedEventBody = savedEventsObj[selectedEvent]!;
    eventNameGlobal.set(choice.eventName);
    payloadArgsGlobal.set(choice.payloadArgs);
    callbackTFGlobal.set(choice.callbackTF);
    cbParamsGlobal.set(choice.cbParams);
    cbBodyGlobal.set(choice.cbBody);
    argsCountGlobal.set(Object.keys(choice.payloadArgs).length);

    // update save input to reflect chosen event
    savedEventName = selectedEvent;
  }

  function sendMessage(): void {
    //if no event was sent, return out
    if (!$eventNameGlobal) return;

    // init exitflag and error message in case values are invalid
    let exitFlag: boolean = false;
    let errMsg: null | string = null;

    // create payloads array using argument strings parsed by json
    const payloads: any[] = Object.values($payloadArgsGlobal).map((el) => {
      if (!exitFlag) {
        return el.argType === 'null' ? null : JSON.parse(el.argValue);
      }
    });

    // if there's a callback function provided, create it
    let cb: null | Function = null;
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
    const eventObject: StoredEvent = {
      socketId: $socketGlobal.id,
      eventName: $eventNameGlobal,
      payload: payloads,
      cb: cb || null,
      date: +new Date(),
      direction: 'Socketman',
      nsp: $socketNspGlobal,
      rooms: [$socketGlobal.id],
    };

    allEventsGlobal.update((value: EventArray) => {
      return [eventObject, ...value];
    });

    // temporary confirmation of success
    alert('Event emitted successfully!');
  }

  function addArg() {
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

  function changeArg(e: any) {
    // update payload obj by cloning it and updating a given key with a new object
    console.log($payloadArgsGlobal[e.detail.argKey]);
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
    console.log($payloadArgsGlobal[e.detail.argKey]);
  }

  function removeArg(e: any) {
    // update payload obj by cloning it and deleting the requested key
    const tempObj = { ...$payloadArgsGlobal };
    delete tempObj[e.detail.argKey];
    payloadArgsGlobal.update(() => {
      return { ...tempObj };
    });
  }
  //modularize functionalities for testing purposes
  const reset = (): void => {
    resetSocketmanStore();
    clearAll();
  };
  // function resetSocketmanStore(): void {
  //   // this is triggered when loading "" as selected event
  //   // and when clicking the "clear all inputs" button
  //   eventNameGlobal.set('');
  //   payloadArgsGlobal.set({});
  //   callbackTFGlobal.set(false);
  //   cbParamsGlobal.set('');
  //   cbBodyGlobal.set('');
  //   argsCountGlobal.set(0);
  // }

  const clearAll = (): void => {
    selectedEvent = '';
    savedEventName = '';
  };
</script>

<svelte:head>
  <title>Socketman</title>
  <meta name="description" content="GUI socketman" />
</svelte:head>

<section id="socketmain">
  <h1>Socketman 🚀</h1>

  <button id="clear-inputs" type="button" on:click={reset}
    >Clear all inputs</button
  >

  <div id="save-container" class="floating">
    <span class="title">Save or Load Event</span>
    <form id="save-form" on:submit|preventDefault={saveEvent}>
      <input
        id="save-input"
        placeholder="Name this emit:"
        bind:value={savedEventName}
      />
      <button id="save-btn">Save event</button>
    </form>
    <div id="save-list-container">
      <span>Choose from your saved events:</span>
      <SaveList {savedEventsObj} {loadEvent} {selectedEvent} />
    </div>
  </div>

  <!-- SOCKETMAN SECTION -->
  <form id="socketman" class="floating" on:submit|preventDefault={sendMessage}>
    <span class="title">Emit an Event</span>
    <h3 id="emit-preview">
      socket.emit({$eventNameGlobal ? `'${$eventNameGlobal}'` : ''}

      {$eventNameGlobal && Object.keys($payloadArgsGlobal).length ? ', ' : ''}
      {Object.values($payloadArgsGlobal)
        .map((el) => el.argLabel)
        .join(', ')}
      {$callbackTFGlobal ? ', callback' : ''})
    </h3>
    <!-- refactor emit preview to add quotation marks to the first parameter (eventname)
      {`socket.emit(${$eventNameGlobal}${
        Object.keys($payloadArgsGlobal).length ? ', ' : ''
      }${Object.values($payloadArgsGlobal)
        .map((el) => el.argLabel)
        .join(', ')}${$callbackTFGlobal ? ', callback' : ''})`}
    </h3> -->
    <div id="socketman-top">
      <input
        id="event"
        bind:value={$eventNameGlobal}
        placeholder="eventName"
        autocomplete="off"
      />
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
      <!-- {#if [Object.values($payloadArgsGlobal), { validJson: $eventNameGlobal === '' ? false : true }].reduce( (sum, cur) => {
        console.log(cur.validJson ? 0 : sum + 1);
        return cur.validJson ? 0 : sum + 1;
      }, 0 )} -->
      <button id="emit-btn" class="disabled" type="button">Can't emit :(</button
      >
    {:else}
      <button id="emit-btn" type="submit">Emit</button>
    {/if}
  </form>
</section>

<style>
  #socketmain {
    display: flex;
    flex-direction: column;
  }
  #clear-inputs {
    align-self: center;
  }
  .floating {
    background-color: rgb(207, 211, 224);
    box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px,
      rgba(0, 0, 0, 0.23) 0px 6px 6px;
  }
  .title {
    text-align: center;
    font-weight: 700;
    font-size: large;
  }
  #save-container {
    display: flex;
    flex-direction: column;
    padding: 20px;
    margin: 12px 10px;
  }
  #save-form {
    display: flex;
    width: 100%;
    margin: 10px 0;
  }
  #save-form input {
    flex-grow: 1;
    margin-right: 10px;
  }
  #save-list-container {
    display: flex;
    flex-direction: column;
  }
  #socketman {
    padding: 20px;
    margin: 12px 10px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    backdrop-filter: blur(10px);
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
    align-self: center;
    background-color: rgb(63, 153, 108);
    width: 50%;
    padding: 7px;
    margin: 20px 0;
    border-radius: 5px;
    outline: none;
    color: #fff;
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

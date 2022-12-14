<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  //export let is how we access props attached to the event component
  export let argLabel: string;
  export let argType: string;
  export let argValue: string;
  export let argKey: number;
  export let validJson: boolean;

  interface errObj {
    header: string;
    description: string;
    expect: string;
    actual: string;
  }
  // worth making a component that appears on mouseover. this will get big-ish in the current file
  let errObj: errObj = {
    header: '',
    description: '',
    expect: '',
    actual: '',
  };

  checkJson(argType, argValue);

  function checkJson(type: string, value: string): void {
    try {
      // check array, obj, null
      if (['array', 'object', 'null'].includes(type)) {
        switch (type) {
          case 'array':
            validJson = value[0] === '[' && JSON.parse(value) ? true : false;
            break;
          case 'object':
            validJson = value[0] === '{' && JSON.parse(value) ? true : false;
            break;
          case 'null':
            validJson = true;
            break;
        }
      }
      // check others
      else if (typeof JSON.parse(value) === type) {
        validJson = true;
      } else {
        validJson = false;
      }
    } catch (error) {
      validJson = false;
    }
    onChange();
  }

  function onDelete() {
    dispatch('removeArg', { argKey });
  }

  function onChange() {
    dispatch('changeArg', { argKey, argLabel, argType, argValue, validJson });
  }
  function tsWorkaround(e: any): void {
    argType = e.target.value;
    checkJson(argType, argValue);
  }
</script>

<div class="argument-row">
  <input
    class="argument-label"
    bind:value={argLabel}
    on:input={onChange}
    placeholder="Arg Label"
    autocomplete="off"
  />
  <select class="argument-type" value={argType} on:change={tsWorkaround}>
    <option>string</option>
    <option>number</option>
    <option>boolean</option>
    <option>null</option>
    <option>object</option>
    <option>array</option>
  </select>
  {#if argType !== 'null'}
    <textarea
      class={'argument-value'}
      bind:value={argValue}
      on:input={() => {
        checkJson(argType, argValue);
      }}
      placeholder="Enter a value using JSON"
      autocomplete="off"
    />
  {:else}
    <textarea
      class={'argument-value null'}
      disabled
      on:input={() => {
        checkJson(argType, argValue);
      }}
      autocomplete="off"
    />
  {/if}
  <div class={`json ${validJson ? 'valid' : 'invalid'}`} />
  <button type="button" on:click={onDelete}>Delete</button>
</div>

<style>
  .argument-row {
    display: flex;
    padding: 5px 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      Helvetica, Arial, sans-serif;
  }
  .argument-row .argument-label {
    width: 15%;
  }
  .argument-row .argument-type {
    width: 10%;
  }
  .argument-row .argument-value {
    flex-grow: 1;
  }
  .json {
    display: flex;
    align-self: center;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    margin: 0 10px;
  }
  .invalid {
    background-color: red;
  }
  .null {
    background-color: rgba(255, 255, 255, 0.4);
  }
</style>

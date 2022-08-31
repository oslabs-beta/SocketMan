<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  //export let is how we access props attached to the event component
  export let argLabel;
  export let argType;
  export let argValue;
  export let argKey;
  export let validJson;

  checkJson(argType, argValue);

  function checkJson(type, value) {
    console.log(type, value);
    try {
      if (typeof JSON.parse(value) === type) {
        console.log(validJson);
        console.log(typeof JSON.parse(value) === type);
        validJson = true;
      } else {
        console.log(validJson);
        validJson = false;
        console.log(validJson);
      }
    } catch (error) {
      console.log(error);
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
</script>

<div class="argument-row">
  <input
    class="argument-label"
    bind:value={argLabel}
    on:change={onChange}
    placeholder="Arg Label"
    autocomplete="off"
  />
  <select
    class="argument-type"
    value={argType}
    on:change={(e) => {
      argType = e.target.value;
      onChange();
      checkJson(argType, argValue);
    }}
  >
    <option>string</option>
    <option>number</option>
    <option>boolean</option>
    <option>null</option>
    <option>object</option>
    <option>array</option>
    <option>undefined</option>
  </select>
  <textarea
    class="argument-value"
    bind:value={argValue}
    on:change={onChange}
    on:input={() => {
      checkJson(argType, argValue);
    }}
    placeholder="Enter a value using JSON"
    autocomplete="off"
  />
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
  .valid {
    /* background-color: green; */
  }
  .invalid {
    background-color: red;
  }
</style>

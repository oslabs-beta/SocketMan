<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  //export let is how we access props attached to the event component
  export let argLabel;
  export let argType;
  export let argValue;
  export let argKey;
  export let validJson;

  // worth making a component that appears on mouseover. this will get big-ish in the current file
  let errObj = {
    header: '',
    description: '',
    expect: '',
    actual: '',
  };

  checkJson(argType, argValue);

  function checkJson(type, value) {
    console.log(type, value);

    try {
      // check array, obj, undefined, null
      if (['array', 'object', 'null', 'undefined'].includes(type)) {
        switch (type) {
          case 'array':
            validJson = value[0] === '[' && JSON.parse(value) ? true : false;
            break;
          case 'object':
            validJson = value[0] === '{' && JSON.parse(value) ? true : false;
            break;
          case 'null':
            validJson =
              value === 'null' && JSON.parse(value) === null ? true : false;
            break;
          case 'undefined':
            validJson = true;
            break;
        }
      }
      // check others
      else if (typeof JSON.parse(value) === type) {
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

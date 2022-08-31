<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  //export let is how we access props attached to the event component
  export let argLabel;
  export let argType;
  export let argValue;
  export let argKey;
  let jsonCheck = false;

  try {
    if (typeof JSON.parse(argValue) === argType) {
      jsonCheck = true;
    } else {
      jsonCheck = false;
    }
  } catch (error) {
    jsonCheck = false;
  }

  const onDelete = () => {
    console.log('onDelete called');
    //remove event is defined on index.svelte
    //everything inside second param is going to be in e.detail => see line 152 on index.svelte
    dispatch('removeArg', { argKey });
  };

  const onChange = () => {
    console.log('onChange called');

    dispatch('changeArg', { argKey, argLabel, argType, argValue });
  };

  const onType = () => {
    // each time this function is called, check if type of JSON result matches what the user said it would be
    try {
      if (typeof JSON.parse(argValue) === argType) {
        jsonCheck = true;
      } else {
        jsonCheck = false;
      }
    } catch (error) {
      jsonCheck = false;
    }
  };
</script>

<div class="argument-row">
  <input
    class="argument-label"
    bind:value={argLabel}
    on:change={onChange}
    placeholder="Arg Label"
    autocomplete="off"
  />
  <input
    class="argument-type"
    bind:value={argType}
    on:change={onChange}
    on:input={onType}
    placeholder="Arg Type"
    autocomplete="off"
  />
  <textarea
    class="argument-value"
    bind:value={argValue}
    on:change={onChange}
    on:input={onType}
    placeholder="Enter a value using JSON"
    autocomplete="off"
  />
  <div class={`json ${jsonCheck ? 'valid' : 'invalid'}`} />
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

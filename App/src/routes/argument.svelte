<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  //export let is how we access props attached to the event component
  export let argLabel;
  export let argType;
  export let argValue;
  export let argKey;

  const onDelete = () => {
    console.log('onDelete called');
    //remove event is defined on index.svelte
    //everything inside second param is going to be in e.detail => see line 152 on index.svelte
    dispatch('removeArg', { argKey });
  };

  const onChange = () => {
    console.log('onChange called');
    //remove event is defined on index.svelte
    //everything inside second param is going to be in e.detail => see line 152 on index.svelte
    dispatch('changeArg', { argKey, argLabel, argType, argValue });
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
    placeholder="Arg Type"
    autocomplete="off"
  />
  <input
    class="argument-value"
    bind:value={argValue}
    on:change={onChange}
    placeholder="Enter a value using JSON"
    autocomplete="off"
  />
  <button type="button" on:click={onDelete}>Delete</button>
</div>

<style>
  .argument-row {
    display: flex;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      Helvetica, Arial, sans-serif;
  }

  .argument-label {
  }

  .argument-type {
  }

  .argument-value {
  }
</style>

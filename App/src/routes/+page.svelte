<script lang="ts">
  import Feed from '../lib/feed/feed.svelte';
  import {
    allEventsGlobal,
    displayEventsGlobal,
    eventLimitGlobal,
    masterFilterGlobal,
    masterOptionsGlobal,
  } from '../stores';
  import type { StoredEvent, EventArray } from '$lib/types';

  let selectedLimit: number = $eventLimitGlobal;

  function updateLimit(e: any): void {
    // update selectedLimit state
    selectedLimit = Number(e.target.value);
    // update stores value
    eventLimitGlobal.set(selectedLimit);
    console.log('$eventLimitGlobal==>', $eventLimitGlobal);
    allEventsGlobal.update((value: EventArray): EventArray => {
      // const eventLimit = getStoreValue(eventLimitGlobal)!;
      if (value.length > selectedLimit)
        return [...value].slice(0, selectedLimit);
      return [...value];
    });
  }

  let stateObj: any = {};

  masterFilterGlobal.subscribe((value) => {
    for (let attribute in value) {
      stateObj[attribute] = [...value[attribute]];
    }
    filter();
  });

  function filter(): void {
    displayEventsGlobal.update(() => {
      console.log('..filter invoked');

      // filter allevents based on applied filters
      return $allEventsGlobal.filter((event) => {
        // loop through applied filters
        for (let attribute in $masterFilterGlobal) {
          // if dealing with rooms attribute, we're looking at an array that we need to check inside of
          if (attribute === 'rooms') {
            let hasRooms = 0;
            // loop through rooms. if we have any of the event rooms in our filter, we're good. else return false
            for (let room of event.rooms) {
              if ($masterFilterGlobal[attribute].has(room)) hasRooms++;
            }
            if (hasRooms === 0) return false;
            // if any attribute other than rooms, if the string does not exist in applied filters, retrun false
          } else if (!$masterFilterGlobal[attribute].has(event[attribute]))
            return false;
        }
        // we've passed all attribute checks; return true
        return true;
      });
    });
  }
  function filterTsWorkaround(
    e: any,
    attribute: string,
    attrValue: string
  ): void {
    console.log(attribute, attrValue);

    masterFilterGlobal.update((value) => {
      const tempSet = new Set(value[attribute]);
      const hadValue = tempSet.delete(attrValue);
      if (hadValue) {
        return {
          ...value,
          [attribute]: tempSet,
        };
      } else {
        return {
          ...value,
          [attribute]: tempSet.add(attrValue),
        };
      }
    });
  }
</script>

<svelte:head>
  <title>GUI Client</title>
  <meta name="description" content="GUI dashboard" />
</svelte:head>

<!-- LISTENERS SECTION -->
<section>
  <h1>Events Log</h1>
  <div>Limit Events</div>
  <select on:change={updateLimit} value={String(selectedLimit)}>
    <option>5</option>
    <option>50</option>
    <option>100</option>
    <option>500</option>
    <option>1000</option>
  </select>
  {#if $allEventsGlobal.length}
    <h4>Filters</h4>
    {#each Object.keys($masterOptionsGlobal) as attribute}
      <div class="filters">
        <div>{attribute.toUpperCase()}</div>
        {#each [...$masterOptionsGlobal[attribute]] as attrValue}
          <label>
            <input
              type="checkbox"
              bind:group={stateObj[attribute]}
              value={attrValue}
              on:change={(e) => filterTsWorkaround(e, attribute, attrValue)}
            />
            {attrValue}
          </label>
        {/each}
      </div>
    {/each}
  {/if}
  <div id="events">
    {#if $displayEventsGlobal.length}
      <Feed />
    {:else}
      <p>No event yet</p>
    {/if}
  </div>
</section>

<style>
  #events {
    display: grid;
    justify-content: flex-start;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    grid-template-areas: 'outgoing gap incoming';
    overflow-y: auto;
    max-height: 80vh;
  }
</style>

import { writable } from 'svelte/store';

export const socketGlobal = writable(null);
export const isFilteredGlobal = writable(false);
export const allEventsGlobal = writable([]);

export const displayEventsGlobal = writable([]);
export const socketIdGlobal = writable('');
export const filterEventNameGlobal = writable('');
export const payloadArgsGlobal = writable({});
export const argsCountGlobal = writable(0);
export const eventNameGlobal = writable('');
export const cbParamsGlobal = writable('');
export const cbBodyGlobal = writable('');
export const callbackTFGlobal = writable(false);

export const displayRulesGlobal = writable({
  incoming: true,
  outgoing: true,
});
export const arrayOfEventNamesGlobal = writable([]);
export const selectedEventNamesGlobal = writable([]);
export const arrayOfSocketIdsGlobal = writable([]);
export const selectedSocketIdsGlobal = writable([]);
export const arrayOfDirectionsGlobal = writable(['incoming', 'outgoing']);
export const selectedDirectionGlobal = writable([]);

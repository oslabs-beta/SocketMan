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

export const displayRules = writable({}); //not using it yet
export const arrayOfEventNamesGlobal = writable([]);
export const arrayOfSocketIdsGlobal = writable([]);
export const arrayOfDirectionsGlobal = writable(['incoming', 'outgoing']);

import { writable } from 'svelte/store';

export const socketGlobal = writable(null);
export const isFilteredGlobal = writable(false);
export const allEventsGlobal = writable([]);
export const filteredEventsGlobal = writable([]);
export const payloadArgsGlobal = writable({});
export const argsCountGlobal = writable(0);
export const eventNameGlobal = writable('');
export const cbParamsGlobal = writable('');
export const cbBodyGlobal = writable('');
export const callbackTFGlobal = writable(false);

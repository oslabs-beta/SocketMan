import type { Socket } from 'socket.io-client';
import { writable } from 'svelte/store';
import type { SIOEvent, StoredEvent, EventArray, ArgsArray } from './lib/types';

interface Directions {
  [index: string]: boolean;
  incoming: boolean;
  outgoing: boolean;
  socketman?: boolean;
}

// socket
export const socketIdGlobal = writable<string>('');
export const socketGlobal = writable<Socket>();
// display
export const allEventsGlobal = writable<EventArray>([]);
export const displayEventsGlobal = writable<EventArray>([]);
// socketman
export const payloadArgsGlobal = writable<ArgsArray>({});
export const argsCountGlobal = writable<number>(0);
export const eventNameGlobal = writable<string>('');
export const cbParamsGlobal = writable<string>('');
export const cbBodyGlobal = writable<string>('');
export const callbackTFGlobal = writable<boolean>(false);
// filtering
export const filterEventNameGlobal = writable<string>(''); // what is this for?
export const isFilteredGlobal = writable<boolean>(false);
export const arrayOfEventNamesGlobal = writable<string[]>([]);
export const arrayOfSocketIdsGlobal = writable<string[]>([]);
export const arrayOfDirectionsGlobal = writable<string[]>([]);
export const selectedSocketIdsGlobal = writable<string[]>([]);
export const selectedEventNamesGlobal = writable<string[]>([]);
export const selectedDirectionGlobal = writable<string[]>([]);
export const displayRulesGlobal = writable<Directions>({
  incoming: true,
  outgoing: true,
});

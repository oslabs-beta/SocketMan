import type { Socket } from 'socket.io-client';
import { writable } from 'svelte/store';
import type { EventArray, ArgsObj } from './lib/types';

interface FilterObj {
  [key: string]: any;
  socketId: Set<string>;
  eventName: Set<string>;
  direction: Set<string>;
  nsp: Set<string>;
  rooms: Set<string>;
}

// socket
export const socketIdGlobal = writable<string>('');
export const socketGlobal = writable<Socket>(undefined);
// display
export const allEventsGlobal = writable<EventArray>([]);
export const displayEventsGlobal = writable<EventArray>([]);
// socketman
export const payloadArgsGlobal = writable<ArgsObj>({});
export const argsCountGlobal = writable<number>(0);
export const eventNameGlobal = writable<string>('');
export const cbParamsGlobal = writable<string>('');
export const cbBodyGlobal = writable<string>('');
export const callbackTFGlobal = writable<boolean>(false);
// filtering
export const masterOptionsGlobal = writable<FilterObj>({
  socketId: new Set<string>(),
  eventName: new Set<string>(),
  direction: new Set<string>(),
  nsp: new Set<string>(),
  rooms: new Set<string>(),
});
export const masterFilterGlobal = writable<FilterObj>({
  socketId: new Set<string>(),
  eventName: new Set<string>(),
  direction: new Set<string>(),
  nsp: new Set<string>(),
  rooms: new Set<string>(),
});
export const eventLimitGlobal = writable<number>(50);
export const socketNspGlobal = writable<string>('');

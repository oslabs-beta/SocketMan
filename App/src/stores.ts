import type { Socket } from 'socket.io-client';
import { writable } from 'svelte/store';
import type { EventArray, ArgsObj } from './lib/types';

//I guess if we had defined this an a interface as opposed to type, do we have to extend at some point?
interface Directions {
  //this allows the direction to be indexed
  [key: string]: boolean;
  incoming: boolean;
  outgoing: boolean;
  socketman?: boolean;
}

//[key: string]: any
//stores were originally written with generics but now we have an expected types
// socket
export const socketIdGlobal = writable<string>('');
export const socketGlobal = writable<Socket>(undefined);
// display
//generics are opprotunity to parameterize types so we can just reference the generic
//ex)
//any would work in this scenario
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
export const filterEventNameGlobal = writable<string>(''); // what is this for?
export const isFilteredGlobal = writable<boolean>(false);
//the following arrays will have string elements
export const arrayOfEventNamesGlobal = writable<string[]>([]);
export const arrayOfSocketIdsGlobal = writable<string[]>([]);
export const arrayOfDirectionsGlobal = writable<string[]>([]);
export const selectedSocketIdsGlobal = writable<string[]>([]);
export const selectedEventNamesGlobal = writable<string[]>([]);
export const selectedDirectionGlobal = writable<string[]>([]);
//need only incoming and outgoing on this property?
export const displayRulesGlobal = writable<Directions>({
  incoming: true,
  outgoing: true,
});
// added to prevent taking up too much memory and effort. presumably testing and debugging will be done on recent events, not events from hours or days ago
export const eventLimitGlobal = writable<number>(50);
// added to track namespace name (can't access from socket later on)
export const socketNspGlobal = writable<string>('');

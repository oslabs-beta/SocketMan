import type * as Kit from '@sveltejs/kit';

export interface SIOEvent {
  socketId: string;
  eventName: string;
  payload: any[];
  cb?: Function | null;
  date: Date | number;
}

interface StoredEvent extends SIOEvent {
  direction: string;
}

export type EventArray = StoredEvent[];

export interface SMArgument {
  argKey: number;
  argValue: string;
  argType: string;
  argLabel: string;
  validJson: boolean;
}

export interface ArgsObj {
  [index: string]: SMArgument;
}

export interface savedEventBody {
  callbackTF: boolean;
  cbBody: string;
  cbParams: string;
  eventName: string;
  payloadArgs: ArgsObj;
}

export interface savedEventsObj {
  [index: string]: savedEventBody;
}

// savedEventsObj[savedEventName] = {
//   callbackTF: $callbackTFGlobal,
//   cbBody: $cbBodyGlobal,
//   cbParams: $cbParamsGlobal,
//   eventName: $eventNameGlobal,
//   payloadArgs: $payloadArgsGlobal,

// export type ArgsArray = SMArgument[];

// export type BoardText = 'X' | 'O' | '-';

// export type BoardRow = [BoardText, BoardText, BoardText];

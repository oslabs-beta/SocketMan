import type * as Kit from '@sveltejs/kit';

export interface StoredEvent {
  socketId: string;
  eventName: string;
  payload: any[];
  cb?: Function | null;
  date: number;
  direction: string;
  nsp: string;
  rooms: string[];
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

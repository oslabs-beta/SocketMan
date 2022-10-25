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
  //getting an error on my end
  date: number;
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

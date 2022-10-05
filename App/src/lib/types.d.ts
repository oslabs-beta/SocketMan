import type * as Kit from '@sveltejs/kit';
//https://www.educative.io/blog/typescript-interfaces
//abstract type that tells compiler which property names a given object can have and the datatypes their vales can hold
//if a property is missig or its value isn't of the same type specified in the interface, compiler throws an error
export interface SIOEvent {
  socketId: string;
  eventName: string;
  //?: just denotes an optional property
  //https://www.logicbig.com/tutorials/misc/typescript/interface-to-describe-object-with-optional-properties.html
  payload?: any[];
  cb?: Function | null;
  date: Date | number;
}
//https://www.typescripttutorial.net/typescript-tutorial/typescript-extend-interface/
//extends allows us to copy properties and methods of one interface to another
//storedEvent interface has all the same properties and type definitions as SIO Event, adding the property string to it
//I know SIOEvent typing relates more to the socketman package, but for the purposes of our gui its necessary to extend and add the direction property for display purposes.
interface StoredEvent extends SIOEvent {
  direction: string;
}
//each el in event array will be an instance of a stored event interface
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

//[index: string]

// export type BoardText = 'X' | 'O' | '-';

// export type BoardRow = [BoardText, BoardText, BoardText];

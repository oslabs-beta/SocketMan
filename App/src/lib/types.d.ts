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
  //can this type be defined as function, I guess yes because technicaly we do not know the return value or the functionality inside the cb
  //but normally, we would type methods within interface based on their return value
  //also can type the paramters but in this case we don't know what the parameters are
  cb?: Function;
  date: Date;
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

//https://medium.com/@martin_hotell/interface-vs-type-alias-in-typescript-2-7-2a8f1777af4c
//I guess we use type here because these args are not exactly optional, but I feel like that has nothing to do with it
//https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces
//type cannot be reopned to add new properties/fields and an interface is always extendable
export type SMArgument = {
  argKey: number;
  argValue: string;
  argType: string;
  argLabel: string;
  validJson: boolean;
};
export type ArgsArray = SMArgument[];

//[index: string]

// export type BoardText = 'X' | 'O' | '-';

// export type BoardRow = [BoardText, BoardText, BoardText];

import type * as Kit from '@sveltejs/kit';

export interface SIOEvent {
  socketId: string;
  eventName: string;
  payload?: any[];
  cb?: Function;
  date: Date;
}

interface StoredEvent extends SIOEvent {
  direction: string;
}

export type EventArray = StoredEvent[];

export type SMArgument = {
  X: number;
  O: number;
};

// export type BoardText = 'X' | 'O' | '-';

// export type BoardRow = [BoardText, BoardText, BoardText];

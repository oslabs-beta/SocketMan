import {
  argsCountGlobal,
  callbackTFGlobal,
  cbBodyGlobal,
  cbParamsGlobal,
  eventNameGlobal,
  payloadArgsGlobal,
  socketGlobal,
  allEventsGlobal,
} from '../../stores';

export function resetSocketmanStore(): void {
  eventNameGlobal.set('');
  payloadArgsGlobal.set({});
  callbackTFGlobal.set(false);
  cbParamsGlobal.set('');
  cbBodyGlobal.set('');
  argsCountGlobal.set(0);
}

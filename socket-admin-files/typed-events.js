'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Feature = void 0;
var Feature;
//created a function definition to take in a param(obj)
(function (Feature) {
  Feature['EMIT'] = 'EMIT';
  Feature['JOIN'] = 'JOIN';
  Feature['LEAVE'] = 'LEAVE';
  Feature['DISCONNECT'] = 'DISCONNECT';
  // the following features are only available starting with Socket.IO v4.0.0
  Feature['MJOIN'] = 'MJOIN';
  Feature['MLEAVE'] = 'MLEAVE';
  Feature['MDISCONNECT'] = 'MDISCONNECT';
  Feature['AGGREGATED_EVENTS'] = 'AGGREGATED_EVENTS';
  Feature['ALL_EVENTS'] = 'ALL_EVENTS';
  //the first time it will define everything (use exports.Feature{}), second time it will pass in what was used last time
})(Feature = exports.Feature || (exports.Feature = {}));

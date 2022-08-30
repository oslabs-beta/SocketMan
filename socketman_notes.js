// x probably expect json syntax ?
// x our input should be able to be primitive
// x can our input read as an object? (make sure it's a yes)
const testEvent = 'testy';
const payload1 = 10;
const payload2 = ['hello', 10];
const payload3 = { key: 'value' };
const payload4 = 'stringy';

// consolidate all payload stuff
const payloads = [payload1, payload2, payload3, payload4];
console.log(payloads);

// 1st test: 2 parameters, returning the sum of those parameters (integers)
// 2nd test: 2 parameters, returning the sum of those parameters (strings)
const sum = new Function('a, b', 'return a + b');
console.log('MARIO TEST !!!', sum(3, 5)); // returns 8
console.log('MARIO TEST !!!', sum('Mario', ' R.')); // returns Mario R.

//3rd test: using a standard parameter and a default parameter, returning the product of those parameters
// const product = new Function('a', 'b=2', 'return a \* b');
// console.log(product(5)); // returns 10

// 4th test: standard parameters & default parameter, return function output recursively
// const repeater = new Function(
// "char, output = ''",
// 'if(output.length === 5) return output; return arguments.callee(char, output += char)'
// );
// console.log(repeater('g')); // returns "repeater is not defined"

// consolidate callback inputs and create function
const params = 'amount'; // make this hold strings, they'll be the param names. make sure to spread it in the constructor
const body = 'console.log(amount); return amount\*4'; // this should be a string. make it do stuff, return stuff, etc. try various complexities, starting simple
// const callback = new Function(params, body);
console.log(testEvent, payloads);
// emit test event, using any params passed including function
// socket.emit(testEvent, ...payloads);

// socket emit to server w/ callback
// server handles event, runs callback
// callback could console.log(info from server)

// number works
let input1 = '12';
console.log(input1, typeof input1);
input1 = JSON.parse(input1);
console.log(input1, typeof input1);

// string works
let input2 = '"hello"';
console.log(input2, typeof input2);
input2 = JSON.parse(input2);
console.log(input2, typeof input2);

// bool works
let input7 = 'true';
console.log(input7, typeof input7);
input7 = JSON.parse(input7);
console.log(input7, typeof input7);

// null works
let input3 = 'null';
console.log(input3, typeof input3);
input3 = JSON.parse(input3);
console.log(input3, typeof input3);

// undefined is not valid in JSON. we'll need UI stuff to be able to pass "undefined"
// symbol is not valid in JSON and we will not support it

// array works (empty or not)
let input5 = '[1,2,3]';
console.log(input5, typeof input5);
input5 = JSON.parse(input5);
console.log(input5, typeof input5.length);

// obj works (empty or not) must be json format
let input6 = '{"key":"value"}';
console.log(input6, typeof input6);
input6 = JSON.parse(input6);
console.log(input6, typeof input6);

// button to add new arg to emit
// // creates on dom: payload label, dropdown to select generic or undefined, inputbox
// // updates string representation of function to be invoked -> socket.emit('eventName', payload1, payload2)
// button to send emit, functionality below to follow :

// all payloads etc are already in some state
// combine them into a list if they aren't already
// if there's a callback selection, create the callback and add it to the payloads list
// run the line of code: socket.emit(eventName, ...payloads)

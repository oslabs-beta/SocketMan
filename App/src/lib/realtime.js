import ioClient from 'socket.io-client';
const ENDPOINT = 'http://localhost:3000';

const socket = ioClient(ENDPOINT);
//const socket = ioClient(); // used when server is not running

export const io = socket;

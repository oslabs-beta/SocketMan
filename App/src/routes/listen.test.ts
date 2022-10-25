import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/svelte';
import type { Socket } from 'socket.io-client';
import { SocketServerMock } from 'socket.io-mock-ts';

import Listen from './+page.svelte';
const { createServer } = require('http');
const { Server } = require('socket.io');
const Client = require('socket.io-client');

//create a test socket in order to properly check listen page

describe("Listen for events from user's server socket", () => {
  const socket = new SocketServerMock();
  const client = socket.clientMock;
  test('renders received event from user server', (done) => {
    //clientSocket represents our gui
    client.on('hello', (arg: any) => {
      expect(arg).toBe('world');
      done();
    });

    //mimics emit from user's server
    socket.emit('hello', 'world');
  });
});
// describe("Listen for events from user's server socket", () => {
//   let io: any, serverSocket: any, clientSocket: any;
//   beforeAll((done) => {
//     const httpServer = createServer();
//     io = new Server(httpServer);
//     console.log('io is=>', io);
//     httpServer.listen(() => {
//       const port = httpServer.address().port;
//       console.log('port is =>', port);
//       clientSocket = new Client(`http://localhost:${port}`);
//       // console.log('client socket is', clientSocket);
//       io.on('connection', (socket: Socket) => {
//         console.log('hi nia...');
//         serverSocket = socket;
//         console.log('server socket is', serverSocket);
//       });
//       clientSocket.on('connect', done);
//     });
//   });

//   afterAll(() => {
//     io.close();
//     clientSocket.close();
//   });

//   //
//   //socket events

// test('shows proper heading when rendered', () => {
//   render(Listen);
//   const heading = screen.getByText('Events Log');
//   expect(heading).toBeInTheDocument();
// });

// test('shows filter options as per event', () => {
//   render(Listen);
// });

//TESTING VIEW: LISTEN
//dynamically created filter options
//when user clicks filter options, checkbox state changes
//individual events are coming properly
//making sure properties on each event renders;

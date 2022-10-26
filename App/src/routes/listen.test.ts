import '@testing-library/jest-dom';

import { render, fireEvent, screen } from '@testing-library/svelte';

import Listen from './+page.svelte';
import { SocketServerMock } from 'socket.io-mock-ts';
//const Client = require('socket.io-client');

test('shows proper heading when rendered', () => {
  render(Listen);
  const heading = screen.getByText('Events Log');
  expect(heading).toBeInTheDocument();
});

describe("Listen for events from user's server socket", () => {
  const socket = new SocketServerMock();
  const client = socket.clientMock;
  test('renders received event from user server', (done) => {
    //clientSocket represents our gui
    client.on('hello', (arg: any) => {
      expect(arg).toBe('world');
      //done();
    });

    //mimics emit from user's server
    socket.emit('hello', 'world');
  });
});

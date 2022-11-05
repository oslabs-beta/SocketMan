import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/svelte';
import type { Socket } from 'socket.io-client';
import { SocketServerMock } from 'socket.io-mock-ts';

import Listen from './+page.svelte';
import Feed from '../lib/feed/feed.svelte';
import svelteEvent from '../lib/feed/event.svelte';

describe('Listen component tests', () => {
  const props = {
    eventname: 'greeting',
    payload: [
      'Nia',
      'Imma',
      {
        morning: 'Good morning',
        noon: 'Good afternoon',
        night: 'Good evening',
      },
      [1, 2, 3],
    ],
    timestamp: '9',
    socketId: '989hhjeriueinYUH',
    direction: 'SocketMan',
    namespace: 'bongo',
    rooms: ["Imma's room", 'Red room'],
  };
  it('shows proper heading when rendered', () => {
    render(Listen);
    const heading = screen.getByText('Events Log');
    expect(heading).toBeInTheDocument();
  });
  it('Component displays Event log heading', () => {
    render(Listen);
    const heading = screen.getByText('Events Log');
    expect(heading).toBeInTheDocument();
  });
  it('Feedcomponent renders events as they come in', () => {
    render(Feed, props);
    const events = screen.getByTestId('all-events');
    expect(events);
  });
});

//create a test socket in order to properly check listen page
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

//TESTING VIEW: LISTEN
//dynamically created filter options
//when user clicks filter options, checkbox state changes
//individual events are coming properly
//making sure properties on each event renders;

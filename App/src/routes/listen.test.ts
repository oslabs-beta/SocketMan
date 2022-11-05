import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/svelte';
import Listen from './+page.svelte';
import Feed from '../lib/feed/feed.svelte';

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

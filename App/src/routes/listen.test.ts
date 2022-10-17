import '@testing-library/jest-dom';

import { render, fireEvent, screen } from '@testing-library/svelte';

import Listen from './+page.svelte';

test('shows proper heading when rendered', () => {
  render(Listen);
  const heading = screen.getByText('Events Log');
  expect(heading).toBeInTheDocument();
});

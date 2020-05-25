import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

describe('test App', () => {
  test('renders header', () => {
    const { getByText } = render(<App />);
    const header = getByText(/Merge and Sort Intervals/i);
    const pre = getByText(/Merge overlapping intervals and sort them./i);
    expect(header).toBeInTheDocument();
    expect(pre).toBeInTheDocument();
  });
});

import React from 'react';
import { render } from '@testing-library/react';
import HomePage from '../pages/index';

describe('HomePage', () => {
  it('should render a heading', () => {
    const { getByRole } = render(<HomePage />);
    const heading = getByRole('heading', {
      name: /welcome to kilil edu platform/i,
    });
    expect(heading).toBeInTheDocument();
  });
});
import React from 'react';
import { render } from '@testing-library/react';
import HomePage from '../app/page';

// Mock next-auth
jest.mock('next-auth/react', () => {
  const originalModule = jest.requireActual('next-auth/react');
  return {
    __esModule: true,
    ...originalModule,
    useSession: () => ({
      data: {
        user: {
          name: 'Test User',
          email: 'test@example.com',
        },
      },
      status: 'authenticated',
    }),
  };
});

describe('HomePage', () => {
  it('should render a heading', () => {
    const { getByRole } = render(<HomePage />);
    const heading = getByRole('heading', {
      name: /welcome to kilil edu platform/i,
    });
    expect(heading).toBeInTheDocument();
  });
});
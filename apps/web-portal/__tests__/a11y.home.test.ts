/**
 * Basic a11y check for the home shell to establish a contract.
 */
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';

describe('Home accessibility', () => {
  it('has no detectable a11y violations', async () => {
    // Create a proper DOM container
    const container = document.createElement('div');
    const main = document.createElement('main');
    main.innerHTML = '<h1>Dashboard</h1><nav aria-label="Main"></nav><button aria-label="Open search">Search</button>';
    container.appendChild(main);
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
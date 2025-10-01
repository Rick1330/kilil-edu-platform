// Polyfill for fetch API
import 'whatwg-fetch';
import { toHaveNoViolations } from 'jest-axe';
import '@testing-library/jest-dom';

expect.extend(toHaveNoViolations);
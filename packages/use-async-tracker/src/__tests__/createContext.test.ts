import { test, describe, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

describe('use-async-tracker', () => {
  afterEach(cleanup);
  test.todo('Returns initial state', () => {
    expect(true).toBe(true);
  });
});

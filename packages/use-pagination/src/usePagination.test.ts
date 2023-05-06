import { expect, test, describe, afterEach } from 'vitest';
import { cleanup, renderHook } from '@testing-library/react';
import { usePagination } from './usePagination';

describe('usePagination', () => {
  afterEach(cleanup);
  test.each([
    [
      { currentPage: 1, totalPages: 5 },
      [
        { type: 'page', value: 1, active: true },
        { type: 'page', value: 2, active: false },
        { type: 'page', value: 3, active: false },
        { type: 'page', value: 4, active: false },
        { type: 'page', value: 5, active: false },
      ],
    ],
    [
      { currentPage: 8, totalPages: 12 },
      [
        { type: 'page', value: 1, active: false },
        { type: 'ellipsis', value: null, active: false },
        { type: 'page', value: 7, active: false },
        { type: 'page', value: 8, active: true },
        { type: 'page', value: 9, active: false },
        { type: 'ellipsis', value: null, active: false },
        { type: 'page', value: 12, active: false },
      ],
    ],
  ])('should return pagination object', (input, expected) => {
    const { result } = renderHook(() => usePagination(input));
    expect(result.current).toEqual(expected);
  });
});

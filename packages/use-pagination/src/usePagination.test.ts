import { expect, test, describe, afterEach } from 'vitest';
import { cleanup, renderHook } from '@testing-library/react';
import { usePagination } from './usePagination';

describe('usePagination', () => {
  afterEach(cleanup);
  test.each([
    [
      { currentPage: 1, totalPages: 5 },
      [
        { id: '1', type: 'page', value: 1, active: true },
        { id: '2', type: 'page', value: 2, active: false },
        { id: '3', type: 'page', value: 3, active: false },
        { id: '4', type: 'page', value: 4, active: false },
        { id: '5', type: 'page', value: 5, active: false },
      ],
    ],
    [
      { currentPage: 8, totalPages: 12 },
      [
        { id: '1', type: 'page', value: 1, active: false },
        { id: 'left', type: 'ellipsis', value: null, active: false },
        { id: '7', type: 'page', value: 7, active: false },
        { id: '8', type: 'page', value: 8, active: true },
        { id: '9', type: 'page', value: 9, active: false },
        { id: 'right', type: 'ellipsis', value: null, active: false },
        { id: '12', type: 'page', value: 12, active: false },
      ],
    ],
  ])('should return pagination object', (input, expected) => {
    const { result } = renderHook(() => usePagination(input));
    expect(result.current).toEqual(expected);
  });
});

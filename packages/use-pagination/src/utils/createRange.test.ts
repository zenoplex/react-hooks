import { describe, test, expect } from 'vitest';
import { createRange } from './createRange';

describe('getRange', () => {
  test.each<[[start: number, end: number], number[]]>([
    /* eslint-disable prettier/prettier */
    [[1, 3],[1, 2, 3]],
    [[5, 10],[5, 6, 7, 8, 9, 10]],
    [[-1, 3],[-1, 0, 1, 2, 3]],
    [[1, 1], [1]],
    /* eslint-enable prettier/prettier */
  ])('should return an array of numbers', (input, expected) => {
    expect(createRange(...input)).toEqual(expected);
  });

  test.each<[[start: number, end: number], number[]]>([
    /* eslint-disable prettier/prettier */
    [[3, 2],[]],
    [[3, -3],[]],
    /* eslint-enable prettier/prettier */
  ])('should return an empty array of numbers', (input, expected) => {
    expect(createRange(...input)).toEqual(expected);
  });
});

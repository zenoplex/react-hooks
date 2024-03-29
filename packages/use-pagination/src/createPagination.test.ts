import { describe, test, expect } from 'vitest';
import { createPagination } from './createPagination';

describe('createPagination', () => {
  test.each([
    [
      { currentPage: 1, totalPages: 1 },
      [{ id: '1', type: 'page', value: 1, active: true }],
    ],
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
      { currentPage: 1, totalPages: 7 },
      [
        { id: '1', type: 'page', value: 1, active: true },
        { id: '2', type: 'page', value: 2, active: false },
        { id: '3', type: 'page', value: 3, active: false },
        { id: '4', type: 'page', value: 4, active: false },
        { id: '5', type: 'page', value: 5, active: false },
        { id: '6', type: 'page', value: 6, active: false },
        { id: '7', type: 'page', value: 7, active: false },
      ],
    ],
  ])('should return an array of numbers', (input, expected) => {
    expect(createPagination(input)).toEqual(expected);
  });

  test.each([
    [
      { currentPage: 1, totalPages: 8 },
      [
        { id: '1', type: 'page', value: 1, active: true },
        { id: '2', type: 'page', value: 2, active: false },
        { id: '3', type: 'page', value: 3, active: false },
        { id: '4', type: 'page', value: 4, active: false },
        { id: '5', type: 'page', value: 5, active: false },
        { id: 'right', type: 'ellipsis', value: null, active: false },
        { id: '8', type: 'page', value: 8, active: false },
      ],
    ],
    [
      { currentPage: 1, totalPages: 9 },
      [
        { id: '1', type: 'page', value: 1, active: true },
        { id: '2', type: 'page', value: 2, active: false },
        { id: '3', type: 'page', value: 3, active: false },
        { id: '4', type: 'page', value: 4, active: false },
        { id: '5', type: 'page', value: 5, active: false },
        { id: 'right', type: 'ellipsis', value: null, active: false },
        { id: '9', type: 'page', value: 9, active: false },
      ],
    ],
    [
      { currentPage: 1, totalPages: 20 },
      [
        { id: '1', type: 'page', value: 1, active: true },
        { id: '2', type: 'page', value: 2, active: false },
        { id: '3', type: 'page', value: 3, active: false },
        { id: '4', type: 'page', value: 4, active: false },
        { id: '5', type: 'page', value: 5, active: false },
        { id: 'right', type: 'ellipsis', value: null, active: false },
        { id: '20', type: 'page', value: 20, active: false },
      ],
    ],
  ])(
    'should return an array of numbers with ellipsis on the right',
    (input, expected) => {
      expect(createPagination(input)).toEqual(expected);
    }
  );

  test.each([
    [
      { currentPage: 8, totalPages: 8 },
      [
        { id: '1', type: 'page', value: 1, active: false },
        { id: 'left', type: 'ellipsis', value: null, active: false },
        { id: '4', type: 'page', value: 4, active: false },
        { id: '5', type: 'page', value: 5, active: false },
        { id: '6', type: 'page', value: 6, active: false },
        { id: '7', type: 'page', value: 7, active: false },
        { id: '8', type: 'page', value: 8, active: true },
      ],
    ],
    [
      { currentPage: 9, totalPages: 9 },
      [
        { id: '1', type: 'page', value: 1, active: false },
        { id: 'left', type: 'ellipsis', value: null, active: false },
        { id: '5', type: 'page', value: 5, active: false },
        { id: '6', type: 'page', value: 6, active: false },
        { id: '7', type: 'page', value: 7, active: false },
        { id: '8', type: 'page', value: 8, active: false },
        { id: '9', type: 'page', value: 9, active: true },
      ],
    ],
    [
      { currentPage: 20, totalPages: 20 },
      [
        { id: '1', type: 'page', value: 1, active: false },
        { id: 'left', type: 'ellipsis', value: null, active: false },
        { id: '16', type: 'page', value: 16, active: false },
        { id: '17', type: 'page', value: 17, active: false },
        { id: '18', type: 'page', value: 18, active: false },
        { id: '19', type: 'page', value: 19, active: false },
        { id: '20', type: 'page', value: 20, active: true },
      ],
    ],
  ])(
    'should return an array of numbers with ellipsis on the left',
    (input, expected) => {
      expect(createPagination(input)).toEqual(expected);
    }
  );

  test.each([
    [
      { currentPage: 5, totalPages: 10 },
      [
        { id: '1', type: 'page', value: 1, active: false },
        { id: 'left', type: 'ellipsis', value: null, active: false },
        { id: '4', type: 'page', value: 4, active: false },
        { id: '5', type: 'page', value: 5, active: true },
        { id: '6', type: 'page', value: 6, active: false },
        { id: 'right', type: 'ellipsis', value: null, active: false },
        { id: '10', type: 'page', value: 10, active: false },
      ],
    ],
    [
      { currentPage: 5, totalPages: 20 },
      [
        { id: '1', type: 'page', value: 1, active: false },
        { id: 'left', type: 'ellipsis', value: null, active: false },
        { id: '4', type: 'page', value: 4, active: false },
        { id: '5', type: 'page', value: 5, active: true },
        { id: '6', type: 'page', value: 6, active: false },
        { id: 'right', type: 'ellipsis', value: null, active: false },
        { id: '20', type: 'page', value: 20, active: false },
      ],
    ],
    [
      { currentPage: 15, totalPages: 20 },
      [
        { id: '1', type: 'page', value: 1, active: false },
        { id: 'left', type: 'ellipsis', value: null, active: false },
        { id: '14', type: 'page', value: 14, active: false },
        { id: '15', type: 'page', value: 15, active: true },
        { id: '16', type: 'page', value: 16, active: false },
        { id: 'right', type: 'ellipsis', value: null, active: false },
        { id: '20', type: 'page', value: 20, active: false },
      ],
    ],
  ])(
    'should return an array of numbers with ellipsis on the both sides',
    (input, expected) => {
      expect(createPagination(input)).toEqual(expected);
    }
  );

  describe('showFirstAndLast', () => {
    test.each([
      [
        { currentPage: 1, totalPages: 5, showFirstAndLast: true },
        [
          { id: 'first', type: 'first', value: 1, active: true },
          { id: '1', type: 'page', value: 1, active: true },
          { id: '2', type: 'page', value: 2, active: false },
          { id: '3', type: 'page', value: 3, active: false },
          { id: '4', type: 'page', value: 4, active: false },
          { id: '5', type: 'page', value: 5, active: false },
          { id: 'last', type: 'last', value: 5, active: false },
        ],
      ],
      [
        { currentPage: 5, totalPages: 5, showFirstAndLast: true },
        [
          { id: 'first', type: 'first', value: 1, active: false },
          { id: '1', type: 'page', value: 1, active: false },
          { id: '2', type: 'page', value: 2, active: false },
          { id: '3', type: 'page', value: 3, active: false },
          { id: '4', type: 'page', value: 4, active: false },
          { id: '5', type: 'page', value: 5, active: true },
          { id: 'last', type: 'last', value: 5, active: true },
        ],
      ],
    ])(
      'should return an array of entities with first and last',
      (input, expected) => {
        expect(createPagination(input)).toEqual(expected);
      }
    );
  });

  describe('showPreviousAndNext', () => {
    test.each([
      [
        { currentPage: 1, totalPages: 5, showPreviousAndNext: true },
        [
          { id: 'previous', type: 'previous', value: 1, active: true },
          { id: '1', type: 'page', value: 1, active: true },
          { id: '2', type: 'page', value: 2, active: false },
          { id: '3', type: 'page', value: 3, active: false },
          { id: '4', type: 'page', value: 4, active: false },
          { id: '5', type: 'page', value: 5, active: false },
          { id: 'next', type: 'next', value: 2, active: false },
        ],
      ],
      [
        { currentPage: 5, totalPages: 5, showPreviousAndNext: true },
        [
          { id: 'previous', type: 'previous', value: 4, active: false },
          { id: '1', type: 'page', value: 1, active: false },
          { id: '2', type: 'page', value: 2, active: false },
          { id: '3', type: 'page', value: 3, active: false },
          { id: '4', type: 'page', value: 4, active: false },
          { id: '5', type: 'page', value: 5, active: true },
          { id: 'next', type: 'next', value: 5, active: true },
        ],
      ],
    ])(
      'should return an array of entities with previous and next',
      (input, expected) => {
        expect(createPagination(input)).toEqual(expected);
      }
    );
  });

  describe('showPreviousAndNext and showFirstAndLast', () => {
    test.each([
      [
        {
          currentPage: 1,
          totalPages: 5,
          showFirstAndLast: true,
          showPreviousAndNext: true,
        },
        [
          { id: 'first', type: 'first', value: 1, active: true },
          { id: 'previous', type: 'previous', value: 1, active: true },
          { id: '1', type: 'page', value: 1, active: true },
          { id: '2', type: 'page', value: 2, active: false },
          { id: '3', type: 'page', value: 3, active: false },
          { id: '4', type: 'page', value: 4, active: false },
          { id: '5', type: 'page', value: 5, active: false },
          { id: 'next', type: 'next', value: 2, active: false },
          { id: 'last', type: 'last', value: 5, active: false },
        ],
      ],
      [
        {
          currentPage: 5,
          totalPages: 5,
          showFirstAndLast: true,
          showPreviousAndNext: true,
        },
        [
          { id: 'first', type: 'first', value: 1, active: false },
          { id: 'previous', type: 'previous', value: 4, active: false },
          { id: '1', type: 'page', value: 1, active: false },
          { id: '2', type: 'page', value: 2, active: false },
          { id: '3', type: 'page', value: 3, active: false },
          { id: '4', type: 'page', value: 4, active: false },
          { id: '5', type: 'page', value: 5, active: true },
          { id: 'next', type: 'next', value: 5, active: true },
          { id: 'last', type: 'last', value: 5, active: true },
        ],
      ],
    ])(
      'should return an array of entities with previous and next',
      (input, expected) => {
        expect(createPagination(input)).toEqual(expected);
      }
    );
  });
});

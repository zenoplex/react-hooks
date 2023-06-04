import { expect, test, describe, afterEach } from 'vitest';
import { cleanup, renderHook, act } from '@testing-library/react';
import { createContext } from '../createContext';

describe('createContext', () => {
  afterEach(cleanup);

  const { Provider, useAsyncTracker } = createContext({ foo: 0, bar: 0 });

  test('Returns Provider and useAsyncTracker', () => {
    expect(Provider).toBeDefined();
    expect(useAsyncTracker).toBeDefined();
  });

  describe('selector', () => {
    test('Selector returning full store', () => {
      const { result } = renderHook(() => useAsyncTracker((store) => store), {
        wrapper: Provider,
      });

      expect(result.current[0]).toStrictEqual({ foo: 0, bar: 0 });
    });

    test('Selector returning partial store', () => {
      const { result, rerender } = renderHook(
        (key) => useAsyncTracker((store) => store[key]),
        {
          wrapper: Provider,
          initialProps: 'foo' as 'foo' | 'bar',
        }
      );
      expect(result.current[0]).toBe(0);

      rerender('bar' as const);
      expect(result.current[0]).toBe(0);
    });
  });

  describe('trackAsync', () => {
    test('Should increment count then decrement on resolve', async () => {
      const { result } = renderHook(
        () => useAsyncTracker((store) => store.foo),
        { wrapper: Provider }
      );

      expect(result.current[0]).toBe(0);
      const trackAsync = result.current[1];

      act(() => {
        const promise = Promise.resolve();
        void trackAsync(promise, 'foo');
      });
      expect(result.current[0]).toBe(1);

      // Wait for promise to resolve
      await act(() => Promise.resolve());
      expect(result.current[0]).toBe(0);
    });

    test('Should increment count then decrement on reject', async () => {
      const { result } = renderHook(
        () => useAsyncTracker((store) => store.foo),
        { wrapper: Provider }
      );

      expect(result.current[0]).toBe(0);
      const trackAsync = result.current[1];

      act(() => {
        void expect(
          trackAsync(Promise.reject(), 'foo')
        ).rejects.toBeUndefined();
      });
      expect(result.current[0]).toBe(1);

      // Wait for promise to resolve
      await act(() => Promise.resolve());

      expect(result.current[0]).toBe(0);
    });

    test.only('Should work in multiple state', async () => {
      const { result } = renderHook(() => useAsyncTracker((store) => store), {
        wrapper: Provider,
      });

      expect(result.current[0]).toStrictEqual({
        foo: 0,
        bar: 0,
      });
      const trackAsync = result.current[1];

      act(() => {
        void trackAsync(Promise.resolve(), 'foo');
      });
      expect(result.current[0]).toStrictEqual({
        foo: 1,
        bar: 0,
      });

      act(() => {
        void trackAsync(Promise.resolve(), 'bar');
      });

      expect(result.current[0]).toStrictEqual({
        foo: 1,
        bar: 1,
      });

      // I wanted to wait for single promise to resolve but await act resolves all promises
      // Wait for promise to resolve
      await act(() => Promise.resolve());
      expect(result.current[0]).toStrictEqual({
        foo: 0,
        bar: 0,
      });
    });
  });
});

import { expect, test, describe, afterEach } from 'vitest';
import { cleanup, renderHook, act, waitFor } from '@testing-library/react';
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
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      await waitFor(() => {});
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
        // catch is required to prevent unhandled promise rejection
        // https://github.com/vitest-dev/vitest/issues/3412
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const promise = Promise.reject().catch(() => {});
        void trackAsync(promise, 'foo');
      });

      expect(result.current[0]).toBe(1);

      // Wait for promise to resolve
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      await waitFor(() => {});

      expect(result.current[0]).toBe(0);
    });
  });
});

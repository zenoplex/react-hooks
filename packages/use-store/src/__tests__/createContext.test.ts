import { expect, test, describe, afterEach } from 'vitest';
import { cleanup, renderHook, act } from '@testing-library/react';
import { createContext } from '../createContext';

describe('createContext', () => {
  afterEach(cleanup);

  const { Provider, useStore } = createContext({ foo: 0, bar: 0 });

  test('Returns Provider and useAsyncTracker', () => {
    expect(Provider).toBeDefined();
    expect(useStore).toBeDefined();
  });

  describe('selector', () => {
    test('Selector returning full store', () => {
      const { result } = renderHook(() => useStore((store) => store), {
        wrapper: Provider,
      });

      expect(result.current[0]).toStrictEqual({ foo: 0, bar: 0 });
    });

    test('Selector returning partial store', () => {
      const { result, rerender } = renderHook(
        (key) => useStore((store) => store[key]),
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

  describe('setStore', () => {
    test('Selector returning full store', () => {
      const { result } = renderHook(() => useStore((store) => store), {
        wrapper: Provider,
      });

      expect(result.current[0]).toStrictEqual({ foo: 0, bar: 0 });
      act(() => {
        result.current[1]({ foo: 1, bar: 2 });
      });
      expect(result.current[0]).toStrictEqual({ foo: 1, bar: 2 });
    });

    test('Updater updating same store key', () => {
      const { result } = renderHook((key) => useStore((store) => store[key]), {
        wrapper: Provider,
        initialProps: 'foo' as 'foo' | 'bar',
      });
      expect(result.current[0]).toBe(0);
      act(() => {
        result.current[1]({ foo: 1 });
      });
      expect(result.current[0]).toBe(1);
    });

    test('Updater updating different store key ', () => {
      const { result } = renderHook((key) => useStore((store) => store[key]), {
        wrapper: Provider,
        initialProps: 'foo' as 'foo' | 'bar',
      });
      expect(result.current[0]).toBe(0);
      act(() => {
        result.current[1]({ bar: 1 });
      });
      expect(result.current[0]).toBe(0);
    });
  });
});

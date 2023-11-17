import { act, renderHook } from '@testing-library/react';
import { describe, test, vi, expect } from 'vitest';
import { useAsync } from './useAsync';

describe('useAsync', () => {
  test('should return with status success', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const { result } = renderHook(() =>
      useAsync(
        () => async () => {
          const response = await fetch('http://200.com');
          return response.json();
        },
        {
          onSuccess,
          onError,
        }
      )
    );

    await act(async () => {
      await result.current.execute();
    });

    const expected = { data: 'success' };
    expect(result.current.status).toBe('success');
    expect(result.current.data).toEqual(expected);
    expect(result.current.error).toBeNull();
    expect(onSuccess).toHaveBeenNthCalledWith(1, expected);
    expect(onError).not.toBeCalled();
  });

  test('should abort request', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const { result } = renderHook(() =>
      useAsync(
        (signal) => async () => {
          const response = await fetch('http://200.com', { signal });
          return response.json();
        },
        {
          onSuccess,
          onError,
        }
      )
    );

    await act(async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const promise = result.current.execute();
      result.current.abort();

      await promise;
    });

    const expected = new DOMException('Aborted', 'AbortError');
    expect(result.current.status).toBe('error');
    expect(result.current.data).toBeNull();
    expect(result.current.error).toEqual(expected);
    expect(onSuccess).not.toBeCalled();
    expect(onError).toHaveBeenNthCalledWith(1, expected);
  });

  test('should be an error if network error', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const { result } = renderHook(() =>
      useAsync(
        () => async () => {
          const response = await fetch('http://network-error.com');
          return response.json();
        },
        {
          onSuccess,
          onError,
        }
      )
    );

    await act(async () => {
      await result.current.execute();
    });

    const expected = new TypeError('Failed to fetch');
    expect(result.current.status).toBe('error');
    expect(result.current.data).toBeNull();
    expect(result.current.error).toEqual(expected);
    expect(onSuccess).not.toBeCalled();
    expect(onError).toHaveBeenNthCalledWith(1, expected);
  });

  test('should be an success if 500', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const { result } = renderHook(() =>
      useAsync(
        () => async () => {
          const response = await fetch('http://500-error.com');
          return response.json();
        },
        { onSuccess, onError }
      )
    );

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.status).toBe('success');
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(onSuccess).toHaveBeenNthCalledWith(1, null);
    expect(onError).not.toBeCalled();
  });
});

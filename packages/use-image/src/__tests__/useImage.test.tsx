import { expect, test, describe, afterEach, beforeAll, afterAll } from 'vitest';
import { cleanup, renderHook, act } from '@testing-library/react';
import { HTMLProps } from 'react';
import useImage from '../useImage';
import { ImageLoadError } from '../errors';

describe('useImage', () => {
  // eslint-disable-next-line functional/no-let
  let originalPrototypeSrc: typeof global.Image.prototype;
  const LOAD_ERROR_SRC = 'LOAD_ERROR_SRC';
  const LOAD_SUCCESS_SRC = 'LOAD_SUCCESS_SRC';
  beforeAll(() => {
    // Keep a copy of original to restore after spec
    originalPrototypeSrc = Object.getOwnPropertyDescriptor(
      global.Image.prototype,
      'src'
    );

    // Mocking Image.prototype.src to call the onload or onerror
    // eslint-disable-next-line functional/immutable-data
    Object.defineProperty(global.Image.prototype, 'src', {
      get() {
        const self = this as HTMLImageElement;
        return self.getAttribute('src');
      },
      set(src: HTMLProps<HTMLImageElement>['src']) {
        if (!src) return;
        const self = this as HTMLImageElement;
        if (src === LOAD_ERROR_SRC) {
          setTimeout(() => {
            // @ts-expect-error Mocking error
            self.onerror?.(new Error('error'));
          });
        } else if (src === LOAD_SUCCESS_SRC) {
          setTimeout(() => {
            self.onload?.(new Event('load'));
          });
        }
        self.setAttribute('src', src);
      },
    });
  });

  afterAll(() => {
    // eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-unsafe-argument
    Object.defineProperty(global.Image.prototype, 'src', originalPrototypeSrc);
  });

  afterEach(cleanup);
  test('Returns initial state', () => {
    const { result } = renderHook(() => useImage());
    expect(result.current.status).toBe('idle');
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
    expect(result.current.load).toBeDefined();
  });

  test('Should return data on successful load', async () => {
    const { result } = renderHook(() => useImage());
    await act(async () => result.current.load(LOAD_SUCCESS_SRC));
    expect(result.current.status).toBe('success'); // // expect(result.current.status).toBe('loading');')
    expect(result.current.data).toStrictEqual({
      width: 0,
      height: 0,
      src: 'LOAD_SUCCESS_SRC',
      url: 'LOAD_SUCCESS_SRC',
    });
    expect(result.current.error).toBeNull();
  });

  test('Should return error on failed load', async () => {
    const { result } = renderHook(() => useImage());
    await act(async () => result.current.load(LOAD_ERROR_SRC));
    expect(result.current.status).toBe('error'); // // expect(result.current.status).toBe('loading');')
    expect(result.current.data).toBeNull();
    expect(result.current.error).toStrictEqual(
      new ImageLoadError('Failed to load image.')
    );
  });
});
